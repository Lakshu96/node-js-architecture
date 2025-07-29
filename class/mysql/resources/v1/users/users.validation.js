const Joi = require('joi');

/** Custom Require **/ 

const response = require('../../../helpers/v1/response.helpers');
const dataHelper = require('../../../helpers/v1/data.helpers');

class UserValidation {

    /** Validate the create user data **/
    createOne = async (req, res, next) => {
        console.log('UsersValidation@createOne');

        let schema = {
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
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        let passwordCheck = await dataHelper.checkPasswordRegex(req.body.password);
        if (!passwordCheck) {
            return response.validationError('validation.strongPassword', res, false);
        }

        if(req.body.password !== req.body.confirm_password){
            return response.validationError('validation.confirmPasswordNotMatch', res, false);
        }

        next();
    }

    /** Validate the resend-otp request **/
    resendOtp = async (req, res, next) => {
        console.log('UsersValidation@resendOtp');

        let schema = {
            email: Joi.string().email().required()
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        next();
    }

    /** Validate the otp verification request **/
    verifyOtp = async (req, res, next) => {
        console.log('UsersValidation@verifyOtp');

        let schema = {
            email: Joi.string().email().required(),
            otp: Joi.number().integer().required()
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        next();
    }

    /** Validate the user login data **/
    userLogin = async (req, res, next) => {
        console.log('UsersValidation@userLogin');

        let schema = {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        next();
    }

    /** Validate the change password request **/
    changePassword = async (req, res, next) => {
        console.log('UsersValidation@changePassword');

        let schema = {
            old_password: Joi.string().required(),
            new_password: Joi.string().required(),
            confirm_new_password: Joi.string().required(),
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        let passwordCheck = await dataHelper.checkPasswordRegex(req.body.new_password);
        if (!passwordCheck) {
            return response.validationError('validation.strongPassword', res, false);
        }

        if(req.body.new_password !== req.body.confirm_new_password){
            return response.validationError('validation.confirmPasswordNotMatch', res, false);
        }

        if(req.body.new_password == req.body.old_password){
            return response.validationError('validation.newAndOldPasswordSame', res, false);
        }

        /** Validate the old password */
        const isOldPasswordValid = await dataHelper.validatePassword(req.body.old_password, req.user.password);
        if(!isOldPasswordValid){
            return response.badRequest("validation.invalidOldPassword", res, false);
        }

        next();
    }

    /** Validate the forgot password request **/
    forgotPassword = async (req, res, next) => {
        console.log("UsersValidation@forgotPassword");
    
        let schema = {
            email: Joi.string().email().required(),
        };
    
        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
        return response.validationError(errors[0], res, errors);
        }
    
        next();
    };

    /** Validate the forgot password OTP verification request **/
    verifyForgotPasswordOTP = async (req, res, next) => {
        console.log("UsersValidation@verifyForgotPasswordOTP");

        let schema = {
            email: Joi.string().email().required(),
            otp: Joi.number().integer().required(),
        };

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        next();
    };

    /** Validate the reset password request **/
    resetPassword = async (req, res, next) => {
        console.log("UsersValidation@resetPassword");

        let schema = {
            password: Joi.string().required(),
            confirm_password: Joi.string().required(),
            user_id: Joi.string().required()
        };
        
        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        let passwordCheck = await dataHelper.checkPasswordRegex(req.body.password);
        if (!passwordCheck) {
            return response.validationError("validation.strongPassword", res, false);
        }

        if (req.body.password !== req.body.confirm_password) {
            return response.validationError("validation.confirmPasswordNotMatch", res, false);
        }

        next();
    };

    /** Validate the delete image data **/
    deleteImage = async (req, res, next) => {
        console.log('UsersValidation@deleteImage');

        let schema = {
            image_url: Joi.string().uri().required()
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        next();
    }

    /** Validate the delete image data **/
    deleteImageAWS = async (req, res, next) => {
        console.log('UsersValidation@deleteImageAWS');

        let schema = {
            image_url: Joi.string().uri().required()
        }

        let errors = await dataHelper.joiValidation(req.body, schema);
        if (errors?.length) {
            return response.validationError(errors[0], res, errors);
        }

        next();
    }
}

module.exports = new UserValidation;
