import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import * as response from '../../../helpers/v1/response.helpers';
import * as dataHelper from '../../../helpers/v1/data.helpers';
import * as nodemailer from '../../../services/nodemailer';
import verificationTemplate from '../../../emailTemplates/v1/verification';
import * as UserResources from './users.resources';
import { UserAttributes } from './user.model';
import * as aws from '../../../services/aws';


const createOne = async (req: Request, res: Response) => {
  console.log('UsersController@createOne');

  const { first_name, last_name, email, password, phone_number, phone_code } = req.body;

  const isUserExist = await UserResources.isUserExist('email', email);
  if (isUserExist) {
    return response.conflict('error.emailExist', res, false);
  }

  const hashedPassword = await dataHelper.hashPassword(password);
  const emailVerificationOtp = await dataHelper.generateSecureOTP(6);

  let userData: any = {
    email,
    password: hashedPassword,
    first_name,
    last_name,
    email_verification_otp: emailVerificationOtp
  };

  if (phone_code && phone_number) {
    userData = { ...userData, phone_code, phone_number };
  }

  if (req?.file?.path) {
    const filePath = req.file.path.replace(/\\/g, '/');
    const fileUrl = `${req.protocol}://${req.get('host')}/${filePath}`;
    userData.profile_picture = fileUrl;
  }

  const hasCreated = await UserResources.createOne(userData);
  if (!hasCreated) {
    if (userData?.profile_picture) {
      const filePath = new URL(userData.profile_picture).pathname;
      const localPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    }
    return response.exception('error.serverError', res, false);
  }

  try {
    const subject = 'Account Verification';
    const html = await verificationTemplate(emailVerificationOtp);
    nodemailer.sendMail(email, subject, html);
  } catch (error) {
    console.log('Error while sending verification email:', error);
  }

  const successMessage = process.env.NODE_ENV === 'development'
    ? res.__('auth.emailCodeSentWithOtp', { code: emailVerificationOtp })
    : res.__('auth.emailCodeSent');

  return response.created(successMessage, res, true);
};

const resendOtp = async (req: Request, res: Response) => {
  console.log('UsersController@resendOtp');

  const { email } = req.body;
  const user = await UserResources.getOneByColumnNameAndValue('email', email);
  if (!user) return response.badRequest('error.invalidEmail', res, false);
  if (user.is_email_verified) return response.badRequest('error.emailAlreadyVerified', res, false);

  const emailVerificationOtp = await dataHelper.generateSecureOTP(6);
  const hasUpdated = await UserResources.updateOne(user.id, { email_verification_otp: Number(emailVerificationOtp) });
  if (!hasUpdated) return response.exception('error.serverError', res, null);

  try {
    const subject = 'Account Verification';
    const html = await verificationTemplate(emailVerificationOtp);
    nodemailer.sendMail(email, subject, html);
  } catch (error) {
    console.log('Error while sending verification email:', error);
  }

  const successMessage = process.env.NODE_ENV === 'development'
    ? res.__('auth.emailCodeSentWithOtp', { code: emailVerificationOtp })
    : res.__('auth.emailCodeSent');

  return response.success(successMessage, res, true);
};

const verifyOtp = async (req: Request, res: Response) => {
  console.log('UsersController@verifyOtp');

  const { email, otp } = req.body;
  const user = await UserResources.getOneByColumnNameAndValue('email', email);
  if (!user) return response.badRequest('error.invalidEmail', res, false);
  if (!user?.email_verification_otp || user.email_verification_otp != otp)
    return response.badRequest('error.invalidOtp', res, false);

  const tokenData = { user_id: user.id, role: user.role };
  const token = await dataHelper.generateJWTToken(tokenData);
  const fcmToken = req.headers['fcm-token'];

  const updatedUser = await UserResources.updateOne(user.id, {
    auth_token: typeof token === 'string' ? token : null,
    fcm_token: typeof fcmToken === 'string' ? fcmToken : null,
    email_verification_otp: null,
    is_email_verified: true
  });

  if (!updatedUser) return response.exception('error.serverError', res, null);

  const formatedUserData = await UserResources.getFormattedData(updatedUser as UserAttributes);

  return response.success('auth.otpVerified', res, { token, user: formatedUserData });
};

const userLogin = async (req: Request, res: Response) => {
  console.log('UsersController@userlogin');

  const { email, password } = req.body;
  const user = await UserResources.getOneByColumnNameAndValue('email', email);
  if (!user) return response.badRequest('auth.invalidCredentails', res, false);

  const isValidPassword = await dataHelper.validatePassword(password, user.password);
  if (!isValidPassword) return response.badRequest('auth.invalidCredentails', res, false);

  const token = await dataHelper.generateJWTToken({ user_id: user.id, role: user.role });
  const fcmToken = req.headers['fcm-token'];
  
  const updatedUser = await UserResources.updateOne(user.id, {
    auth_token: typeof token === 'string' ? token : null,
    fcm_token: typeof fcmToken === 'string' ? fcmToken : null,
  });
  if (!updatedUser) return response.exception('error.serverError', res, null);

  const formatedUserData = await UserResources.getFormattedData(updatedUser as UserAttributes);

  return response.success('auth.loggedIn', res, { token, user: formatedUserData });
};

const changePassword = async (req: Request, res: Response) => {
  const { new_password } = req.body;
  const user = req.user;

  const hashedPassword = await dataHelper.hashPassword(new_password);
  const hasUpdated = await UserResources.updateOne(user.id, { password: hashedPassword });
  if (!hasUpdated) return response.exception('error.serverError', res, null);

  return response.success('auth.passwordChanged', res, true);
};

const getUserProfile = async (req: Request, res: Response) => {
  console.log('UsersController@getUserProfile');
  const user = req.user;
  const formatedUserData = await UserResources.getFormattedData(user as UserAttributes);
  return response.success('success.userProfile', res, formatedUserData);
};

const getAllWithPagination = async (req: Request, res: Response) => {
  console.log('UsersController@getAllWithPagination');

  const { page, limit } = await dataHelper.getPageAndLimit(req.query);
  const filterObj: Partial<UserAttributes> = {
    role: UserResources.roles.USER as UserAttributes['role'],
  };

  const result = await UserResources.getAllWithPagination(page, limit, filterObj);
  const message = result?.data?.length ? 'success.usersData' : 'success.noRecordsFound';

  return response.success(message, res, result);
};

const uploadImage = async (req: Request, res: Response) => {
  if (!req?.file?.path) return response.badRequest('error.fileNotUploaded', res, false);
  const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  return response.success('success.fileUploaded', res, { image_url: fileUrl });
};

const uploadBulkImages = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) return response.badRequest('error.fileNotUploaded', res, false);

  const imageUrls = files.map(file => `${req.protocol}://${req.get('host')}/${file.path.replace(/\\/g, '/')}`);
  return response.success('success.fileUploaded', res, { image_urls: imageUrls });
};

const deleteImage = async (req: Request, res: Response) => {
  try {
    const { image_url } = req.body;
    const localPath = path.join(process.cwd(), new URL(image_url).pathname);

    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
      return response.success('success.fileDeleted', res, true);
    } else {
      return response.badRequest('error.fileNotFound', res, false);
    }
  } catch {
    return response.exception('error.invalidFileUrlToDelete', res, false);
  }
};

const uploadImageAWS = async (req: Request, res: Response) => {
  return response.success('success.fileUploaded', res, { image_url: req.image_url });
};

const deleteImageAWS = async (req: Request, res: Response) => {
  const { image_url } = req.body;
  const hasDeleted = await aws.deleteFile(image_url);
  if (!hasDeleted) return response.badRequest('error.fileNotFound', res, false);
  return response.success('success.fileDeleted', res, true);
};

const logout = async (req: Request, res: Response) => {
  const user = req.user;
  const hasUpdated = await UserResources.updateOne(user.id, { auth_token: '', fcm_token: '' });
  if (!hasUpdated) return response.exception('error.serverError', res, null);
  return response.success('auth.logoutSuccess', res, true);
};

const deleteOne = async (req: Request, res: Response) => {
  const user = req.user;
  const hasDeleted = await UserResources.updateOne(user.id, {
    deleted_at: new Date(),
  });
  if (!hasDeleted) return response.exception('error.serverError', res, null);
  return response.success('auth.deleteAccount', res, true);
};

export {
  createOne,
  resendOtp,
  userLogin,
  changePassword,
  getUserProfile,
  verifyOtp,
  getAllWithPagination,
  uploadImage,
  uploadBulkImages,
  deleteImage,
  uploadImageAWS,
  deleteImageAWS,
  logout,
  deleteOne
};
