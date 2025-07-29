import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/** Custom Require **/
import * as response from '../../../helpers/v1/response.helpers';
import * as dataHelper from '../../../helpers/v1/data.helpers';

export const createOne = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@createOne');

    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().optional(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirm_password: Joi.string().required(),
        phone_number: Joi.number().optional(),
        phone_code: Joi.string()
            .when('phone_number', {
                is: Joi.exist(),
                then: Joi.required(),
                otherwise: Joi.optional()
            })
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    const passwordCheck = await dataHelper.checkPasswordRegex(req.body.password);
    if (!passwordCheck) {
        return response.validationError('validation.strongPassword', res, false);
    }

    if (req.body.password !== req.body.confirm_password) {
        return response.validationError('validation.confirmPasswordNotMatch', res, false);
    }

    next();
};

export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@resendOtp');

    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    next();
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@verifyOtp');

    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.number().integer().required()
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    next();
};

export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@userLogin');

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    next();
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@changePassword');

    const schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().required(),
        confirm_new_password: Joi.string().required(),
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    const passwordCheck = await dataHelper.checkPasswordRegex(req.body.new_password);
    if (!passwordCheck) {
        return response.validationError('validation.strongPassword', res, false);
    }

    if (req.body.new_password !== req.body.confirm_new_password) {
        return response.validationError('validation.confirmPasswordNotMatch', res, false);
    }

    if (req.body.new_password === req.body.old_password) {
        return response.validationError('validation.newAndOldPasswordSame', res, false);
    }

    // Validate old password
    const isOldPasswordValid = await dataHelper.validatePassword(req.body.old_password, req.user?.password);
    if (!isOldPasswordValid) {
        return response.badRequest("validation.invalidOldPassword", res, false);
    }

    next();
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@deleteImage');

    const schema = Joi.object({
        image_url: Joi.string().uri().required()
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    next();
};

export const deleteImageAWS = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    console.log('UsersValidation@deleteImageAWS');

    const schema = Joi.object({
        image_url: Joi.string().uri().required()
    });

    const errors = await dataHelper.joiValidation(req.body, schema);
    if (errors?.length) {
        return response.validationError(errors[0], res, errors);
    }

    next();
};
