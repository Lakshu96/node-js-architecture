// types/express.d.ts

import { UserAttributes } from '@/resources/v1/users/user.model';
import { Multer } from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    maxFileCount?: number;
    image_url?: string;
    file?: Express.Multer.File;
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    user?: any; 
  }
}
