import { CalculatePaginationType, PageLimitQuery, PageLimitResult, PaginationResult } from "@/types/dataHelper.types";
import Joi, { SchemaMap } from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request } from 'express';

/* Valiate the request body as per the provided schema */
export const joiValidation = async (reqBody:any, schema:any, language:string = 'en'):Promise<any> => {
    console.log('DataHelper@joiValidation');

    try {
        await Joi.object(schema).validateAsync(reqBody)
        return false;
    }
    catch (errors:any) {
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
export const checkPasswordRegex = async (password:string):Promise<boolean> => {
    console.log('DataHelper@passwordRegex');

    let passwordRegex = RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[@$!%*?&]).{8,}');
    if (!passwordRegex.test(password)) {
        return false
    }
    return true;
}

/* Convert password string into hash */
export const hashPassword = async (password:string):Promise<string> => {
    console.log('DataHelper@hashPassword');

    let hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        throw new Error('Error generating password hash');
    }

    return hashedPassword;
}

/* Validate the hashed password and the password string */
export const validatePassword = async (passwordString:string, passwordHash:string):Promise<boolean> =>{
    console.log("DataHelper@validatePassword");

    let isPasswordValid = await bcrypt.compare(passwordString, passwordHash)
    if (!isPasswordValid) {
        return false
    }

    return true
}

/* Generate the JWT token */
export const generateJWTToken = async (data:Object):Promise<string|boolean> => {
    console.log("DataHelper@generateJWTToken");

    let token = jwt.sign(data, process.env.JWT_TOKEN_KEY||"secret");
    if (!token) {
        return false;
    }

    return token;
}

/* Generate OTP */
export const generateSecureOTP = async (length:number = 6): Promise<string> => {
    console.log('DataHelper@generateSecureOTP');

    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[crypto.randomInt(0, digits.length)];
    }
    return otp;
}

/** Validate the email */
export const isValidEmail = async (value:string):Promise<boolean> => {
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
        return true;
    } else {
        return false;
    }
}

/** Extract the page and limit from query params */
export const getPageAndLimit = async (reqQuery: PageLimitQuery
): Promise<PageLimitResult> =>{
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
export const calculatePagination = async ( totalItems: number | null = null,
  currentPage: number | null = null,
  limit: number | null = null):Promise<PaginationResult> => {
    console.log('DataHelper@calculatePagination');

    // set a default currentPage if it's not provided
    if (!currentPage) {
        currentPage = 1;
    }

    // set a default limit if it's not provided
    if (!limit) {
        limit = totalItems && totalItems > 50 ? 50 : totalItems || 50;
    }

    const totalPages = Math.max(1, Math.ceil((totalItems || 0) / limit));
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