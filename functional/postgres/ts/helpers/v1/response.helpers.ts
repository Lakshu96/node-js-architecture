import { Response } from 'express';
import dotenv from 'dotenv';
import i18n from '../../config/v1/i18n';

dotenv.config();

type ResponseData =any;

const sendResponse = async (
  code: number,
  msg: string,
  res: Response,
  data?: ResponseData
): Promise<Response> => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');

  const responseBody: any = {
    statusCode: code,
    api_ver: process.env.API_VER || 'v1',
    message: i18n.__(msg),
  };

  if (data) responseBody.data = data;

  return res.status(code).send(responseBody);
};

const success = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(200, msg, res, data);

const created = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(201, msg, res, data);

const disallowed = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(405, msg, res, data);

const noContent = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(204, msg, res, data);

const badRequest = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(400, msg, res, data);

const validationError = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(422, msg, res, data);

const unauthorized = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(401, msg, res, data);

const forbidden = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(403, msg, res, data);

const notFound = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(404, msg, res, data);

const exception = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(500, msg, res, data);

const conflict = async (msg: string, res: Response, data?: ResponseData) =>
  sendResponse(409, msg, res, data);

const custom = async (code: number, msg: string, res: Response, data?: ResponseData) =>
  sendResponse(code, msg, res, data);

const redirect = async (url: string, res: Response): Promise<Response> =>
  res.status(302).send({
    api_ver: process.env.API_VER,
    redirect_to: url,
  });

const twoFactorEnabled = async (res: Response): Promise<Response> => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return res.status(200).send({
    api_ver: process.env.API_VER,
    msg: 'TwoFactor authentication has been enabled for your account. We have sent you an access code to the phone associated to your account. Please verify the code to proceed',
    two_factor: true,
  });
};

export {
  success,
  created,
  disallowed,
  noContent,
  badRequest,
  validationError,
  unauthorized,
  forbidden,
  notFound,
  exception,
  conflict,
  custom,
  redirect,
  twoFactorEnabled,
  sendResponse,
};
