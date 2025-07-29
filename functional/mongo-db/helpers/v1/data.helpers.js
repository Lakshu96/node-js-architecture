const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/* Valiate the request body as per the provided schema */
const joiValidation = async (reqBody, schema, language = 'en') => {
    console.log('DataHelper@joiValidation');

    try {
        await Joi.object(schema).validateAsync(reqBody)
        return false;
    }
    catch (errors) {
        let parsedErrors = [];

        if (errors.details) {
            errors = errors.details
            for (let e of errors) {
                let msg = e.message.replace(/"/g, '');
                parsedErrors.push(msg)
            }
        }

        if (parsedErrors.length > 0) {
            return parsedErrors;
        }
        else {
            return false;
        }
    }
}

/* Check the password strength */
const checkPasswordRegex = async (password) => {
    console.log('DataHelper@passwordRegex');

    let passwordRegex = RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[@$!%*?&]).{8,}');
    if (!passwordRegex.test(password)) {
        return false
    }
    return true;
}

/* Convert password string into hash */
const hashPassword = async (password) => {
    console.log('DataHelper@hashPassword');

    let hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        throw new Error('Error generating password hash');
    }

    return hashedPassword;
}

/* Validate the hashed password and the password string */
const validatePassword = async (passwordString, passwordHash) =>{
    console.log("DataHelper@validatePassword");

    let isPasswordValid = await bcrypt.compare(passwordString, passwordHash)
    if (!isPasswordValid) {
        return false
    }

    return true
}

/* Generate the JWT token */
const generateJWTToken = async (data) => {
    console.log("DataHelper@generateJWTToken");

    let token = jwt.sign(data, process.env.JWT_TOKEN_KEY);
    if (!token) {
        return false;
    }

    return token;
}

/* Generate OTP */
const generateSecureOTP = async (length = 6) => {
    console.log('DataHelper@generateSecureOTP');

    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[crypto.randomInt(0, digits.length)];
    }
    return otp;
}

/** Validate the email */
const isValidEmail = async (value) => {
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
        return true;
    } else {
        return false;
    }
}

/** Extract the page and limit from query params */
const getPageAndLimit = async (reqQuery) =>{
    console.log('DataHelper@getPageAndLimit');

    let resObj = {
        page: 1,
        limit: 50,
    };

    if (reqQuery.page) {
        let pageNo = parseInt(reqQuery.page);

        if (typeof (pageNo) !== 'number') {
            pageNo = 1;
        }
        else if (pageNo < 1) {
            pageNo = 1;
        }

        resObj.page = pageNo;
    }

    if (reqQuery.limit) {
        let limit = parseInt(reqQuery.limit);

        if (typeof (limit) !== 'number') {
            limit = 50;
        }
        else if (limit < 1) {
            limit = 50;
        }

        if (limit > 100) {
            limit = 100;
        }

        resObj.limit = limit;
    }

    return resObj;
}

/** Calculate the pagination param and return the offest */
const calculatePagination = async (totalItems = null, currentPage = null, limit = null) => {
    console.log('DataHelper@calculatePagination');

    // set a default currentPage if it's not provided
    if (!currentPage) {
        currentPage = 1;
    }

    // set a default limit if it's not provided
    if (!limit) {
        if (totalItems > 50) {
            limit = 50
        } else {
            limit = totalItems;
        }
    }

    let totalPages = Math.ceil(totalItems / limit);
    if (totalPages < 1) {
        totalPages = 1;
    }

    // if the page number requested is greater than the total pages, set page number to total pages
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let offset;
    if (currentPage > 1) {
        offset = (currentPage - 1) * limit;
    } else {
        offset = 0;
    }

    return {
        currentPage,
        totalPages,
        offset,
        limit
    }
}

module.exports = {
    joiValidation,
    checkPasswordRegex,
    hashPassword,
    validatePassword,
    generateJWTToken,
    generateSecureOTP,
    isValidEmail,
    getPageAndLimit,
    calculatePagination
}

// const _ = require('lodash');
// const hash = require('object-hash');
// const bcrypt = require('bcryptjs');
// const axios = require('axios');
// const Joi = require('joi');
// const slugify = require('slugify');
// const jwt = require('jsonwebtoken');
// const i18n = require('i18n')
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const { PDFDocument,rgb,StandardFonts } = require('pdf-lib');
// module.exports = class DataHelper {


//     async generateUuid() {
//         return uuidv4();
//     }

//     async generateHash(value) {
//         console.log('DataHelper@generateHash');
//         // generate a token
//         let hashedValue = hash.sha1({
//             value: value,
//             random: new Date(),
//         });

//         return hashedValue;
//     }

//     async replaceSpaces(value, replaceValue) {
//         console.log('DataHelper@replaceSpaces');
//         let newString = value.replace(/\s+/g, replaceValue);
//         newString = newString.replace(/[';"!@#$%^&*]/g, '');

//         console.log('returning string: ', newString);
//         return newString;
//     }

//     async generateSlug(value, replaceValue) {
//         console.log('DataHelper@generateSlug');
//         let newString = slugify(value, {
//             replacement: replaceValue,
//             lower: true
//         })

//         console.log('returning string: ', newString);
//         return newString;
//     }

//     async generateRandomNumber(length = 5) {
//         console.log('DataHelper@generateRandomNumber');

//         let numString = '9';
//         let addNumber = '1';
//         for (let x = 0; x < length - 1; x++) {
//             numString += 0
//             addNumber += 0
//         }

//         let number = parseInt(numString);
//         let randomNumber = Math.floor(Math.random() * Math.floor(number) + parseInt(addNumber));

//         return randomNumber;
//     }

//     async validateDateFormat(date) {
//         console.log('DataHelper@validateDateFormat');

//         let dateRegex = RegExp('^(20[0-9][0-9])[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$');

//         if (!dateRegex.test(date)) {
//             return false
//         }
//         return true;
//     }

//     // async parseJoiErrors(errors) {
//     //     console.log('DataHelper@parseJoiErrors');
//     //     let parsedErrors = [];

//     //     if (errors.error) {
//     //         errors = errors.error.details

//     //         for (let e = 0; e < errors.length; e++) {
//     //             let msg = errors[e].message
//     //             msg = msg.replace(/["']/g, "")
//     //             parsedErrors.push(msg.replace(/_/g, ' '))
//     //         }
//     //     }

//     //     return parsedErrors;
//     // }

//     async generatUniqueId() {
//         console.log('DataHelper@generatUniqueId');
//         let uniqueId = Math.floor(1000 + Math.random() * 9000)
//         return uniqueId
//     }

//     async checkPhoneNumber(number) {
//         console.log('DataHelper@checkPhoneNumber');
//         const reg = /^(\+\d{1,3}[- ]?)?\d{10}$/;
//         if (reg.test(number) === false) {
//             return true;
//         }
//         return false
//     }

//     async validatePhone(phoneNumber) {
//         console.log('DataHelper@validatePhone');
//         let regex = RegExp('^[0-9]{10}$');

//         if (!regex.test(phoneNumber)) {
//             return false;
//         }

//         return true;
//     }

//     async isValidMongoDBId(id) {
//         console.log('DataHelper@isValidMongoDBId');
//         if (!id || id == '') {
//             return false;
//         }
//         return id.match(/^[0-9a-fA-F]{24}$/);
//     }

//     async generateBase64FromUrl(url) {
//         try {
//             const image = await axios.get(url, { responseType: 'arraybuffer' });
//             const raw = await Buffer.from(image.data).toString('base64');
//             const base64Image = "data:" + image.headers["content-type"] + ";base64," + raw
//             return base64Image
//         }
//         catch (error) {
//             console.log(error);
//             return ""
//         }
//     }