const express = require('express');
const routes = express.Router();

/** Controllers **/ 
const userController = require("../resources/v1/users/users.controller");

/** Resources **/ 
const userResources = require("../resources/v1/users/users.resources");

/** Validations **/ 
const userValidation = require("../resources/v1/users/users.validation");

/** Middleware **/ 
const authMiddleware = require("../middleware/v1/authorize");

/** Utility file */
const uploadUtils = require("../utils/upload");
const aws = require("../services/aws");

const dateObj = new Date();
const uploadDirectory = "uploads/" + dateObj.getFullYear() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
const validFileExtenstions = /jpg|jpeg|png|heic/;
const maxFileSize = 5 * 1024 * 1024 // 5 MB

/** Routes **/ 
routes.post('/create', [ uploadUtils.uploadFile(validFileExtenstions, maxFileSize, uploadDirectory).single('image'), userValidation.createOne ], userController.createOne);
routes.post('/resend-otp', [ userValidation.resendOtp ], userController.resendOtp);
routes.post('/verify', [ userValidation.verifyOtp ], userController.verifyOtp);
routes.post('/login', [ userValidation.userLogin ], userController.userLogin);
routes.post('/change-password', [ authMiddleware.auth(), userValidation.changePassword ], userController.changePassword);
routes.post("/forgot-password", [ userValidation.forgotPassword ], userController.forgotPassword);
routes.post("/forgot-password/verify-otp", [ userValidation.verifyForgotPasswordOTP ], userController.verifyForgotPasswordOTP);
routes.post("/reset-password", [ userValidation.resetPassword ], userController.resetPassword);
routes.get('/profile', [ authMiddleware.auth() ], userController.getUserProfile);
routes.get('/', [ authMiddleware.auth(userResources.roles.ADMIN) ], userController.getAllWithPagination);
routes.get('/logout', [authMiddleware.auth()], userController.logout)
routes.delete('/', [authMiddleware.auth()], userController.deleteOne);

routes.post(
    '/upload-image',
    [   
        authMiddleware.auth(),
        uploadUtils.uploadFile(validFileExtenstions, maxFileSize, uploadDirectory).single('image')
    ],
    userController.uploadImage
);

routes.post(
    '/upload-bulk-images',
    [   
        authMiddleware.auth(),
        uploadUtils.setMaxFileLimit(5), // To return the valid images count in error
        uploadUtils.uploadFile(validFileExtenstions, maxFileSize, uploadDirectory).array('images', 5)
    ],
    userController.uploadBulkImages
);
routes.post('/delete-image', [ userValidation.deleteImage ], userController.deleteImage);

routes.post(
    '/upload-image-aws',
    [   
        authMiddleware.auth(),
        uploadUtils.uploadFile(validFileExtenstions, maxFileSize, 'uploads/temp').single('image'),
        aws.uploadFile
    ],
    userController.uploadImageAWS
);
routes.post('/delete-image-aws', [ userValidation.deleteImageAWS ], userController.deleteImageAWS);

module.exports = routes;