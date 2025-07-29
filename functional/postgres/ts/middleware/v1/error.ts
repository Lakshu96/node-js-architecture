import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// Custom i18n
import i18n from '../../config/v1/i18n';

declare module 'express-serve-static-core' {
  interface Request {
    maxFileCount?: number;
  }
}

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  console.log('ErrorMiddleware', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        msg: i18n.__('error.tooManyFilesUploaded'),
        error: ""
      });
    }

    return res.status(400).json({
      msg: i18n.__('error.multerError'),
      error: err.message,
    });
  }

  const errorMessage: string =
    typeof err === 'string' ? err : err?.message || i18n.__('error.internalServerError');

  return res.status(500).json({
    msg: i18n.__('error.serverError'),
    error: errorMessage,
  });
};

export default errorMiddleware;
