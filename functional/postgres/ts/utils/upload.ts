import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Custom Require
import i18n from '../config/v1/i18n';

// Add to Request interface for maxFileCount if needed
declare module 'express-serve-static-core' {
    interface Request {
        maxFileCount?: number;
    }
}

// Create a Multer disk storage configuration
const createStorage = (directoryPath: string = 'uploads/default'): StorageEngine => {

    return multer.diskStorage({
        destination: (req, file, cb) => {
            fs.mkdirSync(directoryPath, { recursive: true });
            cb(null, directoryPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${file.fieldname}-${uuidv4()}-${moment().unix()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        }
    });
};

// General-purpose uploader with file type and size validation
const fileUploader = (
    typeRegex: RegExp,
    fileSize: number,
    directoryPath: string
): multer.Multer => {
   
    const storage = createStorage(directoryPath);

    return multer({
        storage,
        limits: { fileSize },
        fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
            const isValid = typeRegex.test(path.extname(file.originalname).toLowerCase());
            if (isValid) {
                cb(null, true);
            } else {
                cb(new Error(i18n.__('error.invalidFileType')));
            }
        }
    });
};

/**
 * Upload File Utility
 * @param type allowed file type regex
 * @param fileSize max file size in bytes (default 5MB)
 * @param directoryPath upload folder path (default: uploads/default)
 */
const uploadFile = (
    type: RegExp = /jpg|jpeg|png|heic/,
    fileSize: number = 5 * 1024 * 1024,
    directoryPath: string = 'uploads/default'
): multer.Multer => {
    return fileUploader(type, fileSize, directoryPath);
};

/**
 * Middleware to limit number of uploaded files
 */
const setMaxFileLimit = (maxCount: number) => (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    req.maxFileCount = maxCount;
    next();
};

// Export all functions
export {
    uploadFile,
    setMaxFileLimit
};
