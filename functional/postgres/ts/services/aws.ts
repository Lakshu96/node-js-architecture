import path from 'path';
import fs from 'fs';
import moment from 'moment-timezone';
import { v4 as uuidv4 } from 'uuid';
import heicConvert from 'heic-convert';
import AWS from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

/** Custom Require **/
import * as response from '../helpers/v1/response.helpers';
/** Extend Express Request for image_url */

// Create S3 instance
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.AWS_S3_BUCKET_NAME
  }
});

/** Upload a single file to AWS S3 */
const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  console.log('AWSService@uploadFile');

  if (!req?.file?.path) {
    return response.badRequest('error.fileNotFound', res, false);
  }

  try {
    const file = req.file;

    const dateObj = new Date();
    const uploadDirectory = `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    let fileName = `${file.fieldname}-${uuidv4()}-${moment().unix()}${path.extname(file.originalname)}`;
    let contentType = file.mimetype;
    let fileBuffer = await fs.promises.readFile(file.path);

    // Convert HEIC/HEIF to JPEG
    if (file.mimetype === 'image/heic' || file.mimetype === 'image/heif') {
      const jpegBuffer = await heicConvert({
        buffer: fileBuffer,
        format: 'JPEG',
        quality: 0.8
      });

      fileBuffer = jpegBuffer;
      fileName = fileName.replace(/\.heic|\.heif$/i, '.jpeg');
      contentType = 'image/jpeg';
    }

    // Define upload parameters
    const params: AWS.S3.PutObjectRequest = {
      ACL: 'public-read',
      Body: fileBuffer,
      Key: `${uploadDirectory}/${fileName}`,
      ContentType: contentType,
      Bucket: process.env.AWS_S3_BUCKET_NAME as string
    };

    const uploadedData = await s3.upload(params).promise();

    if (!uploadedData.Location) {
      return response.badRequest('error.fileNotUploaded', res, false);
    }

    req.image_url = uploadedData.Location;

    // Clean up: delete the local file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    next();

  } catch (error) {
    console.error('Upload error:', error);
    return response.badRequest('error.fileNotUploaded', res, false);
  }
};

/** Delete file from AWS S3 */
const deleteFile = async (fileUrl: string): Promise<boolean> => {
  console.log('AWSService@deleteFile');

  try {
    const url = new URL(fileUrl);
    const key = decodeURIComponent(url.pathname.substring(1)); // remove leading '/'

    const params: AWS.S3.DeleteObjectRequest = {
      Key: key,
      Bucket: process.env.AWS_S3_BUCKET_NAME as string
    };

    await s3.deleteObject(params).promise();
    return true;

  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
};

export {
  uploadFile,
  deleteFile
};
