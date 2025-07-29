const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone')
const { v4: uuidv4 } = require('uuid');
const heicConvert = require("heic-convert");
const AWS = require('aws-sdk');

/** Custom Require **/ 
const response = require('../helpers/v1/response.helpers');

class AWSService {

    constructor() {
        // Created AWS S3 instance
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            params: { 
                Bucket: process.env.AWS_S3_BUCKET_NAME 
            }
        });
    }

    // Upload a single file to AWS S3 after storing locally
    uploadFile = async (req, res, next) => {
        console.log('AWSService@uploadFile');

        if (!req?.file?.path) {
            return response.badRequest("error.fileNotFound", res, false);
        }

        try {
            const file = req.file;

            const dateObj = new Date();
            const uploadDirectory = dateObj.getFullYear() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getDate();
            let fileName = file.fieldname + '-' + uuidv4() + '-' + moment().unix() + path.extname(file.originalname);
            let contentType = file.mimetype;
            let fileBuffer = await fs.promises.readFile(file.path);

            // Convert HEIC to JPEG if necessary
            if (file.mimetype === "image/heic" || file.mimetype === "image/heif") {
                const jpegBuffer = await heicConvert({
                    buffer: fileBuffer,
                    format: "JPEG",
                    quality: 0.8,
                });

                fileBuffer = jpegBuffer; // Use converted buffer
                fileName = fileName.replace(/\.heic|\.heif$/, ".jpeg");
                contentType = "image/jpeg";
            }

            // Defined S3 bucket params to upload the file
            const params = {
                ACL: "public-read",
                // Bucket: process.env.AWS_S3_BUCKET,
                Body: fileBuffer,
                Key: `${uploadDirectory}/${fileName}`,
                ContentType: contentType,
            };

            const uploadedData = await this.s3.upload(params).promise();
            if(!uploadedData.Location){
                return response.badRequest("error.fileNotUploaded", res, false);
            }

            // Attached uploaded image URL with request for further use
            req.image_url = uploadedData.Location;

            // Delete file after uploading to S3
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            next();

        } catch (error) {
            console.log('Upload error:', error);
            return response.badRequest("error.fileNotUploaded", res, false);
        }
    };

    deleteFile = async (fileUrl) => {
        console.log('AWSService@deleteFile');

        // const bucket = process.env.AWS_S3_BUCKET_NAME;
        const url = new URL(fileUrl);
        const key = decodeURIComponent(url.pathname.substring(1)); // remove leading `/`

        try {
            let params = {
                // Bucket: bucket,
                Key: key
            };
            await this.s3.deleteObject(params).promise();
            
            return true;

        } catch (err) {
            return false;
        }
    }
}

// Export all functions
module.exports = new AWSService;