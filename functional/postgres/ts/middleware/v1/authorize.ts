import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/** Custom Imports **/
import * as response from '../../helpers/v1/response.helpers';
import * as UserResources from '../../resources/v1/users/users.resources';

/** Extend Request type to include user */


/** Verify JWT Token */
export const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    const secret = process.env.JWT_TOKEN_KEY;
    if (!secret) return reject(new Error('JWT secret not configured'));

    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);

      if (typeof decoded === 'string' || !decoded) {
        return reject(new Error('Invalid token payload'));
      }

      resolve(decoded as JwtPayload);
    });
  });
};

/** Authorization Middleware */
const auth = (roleToValidate: string | null = null) => {

  return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    console.log('AuthorizationMiddleware@auth');

    const token = req.headers['authorization'];

    if (!token || typeof token !== 'string') {
      return response.unauthorized('auth.unauthorizedRequest', res, false);
    }

    try {
      // Decode token
      const decoded = await verifyToken(token) as JwtPayload;

      const userId = decoded?.user_id;
      if (!userId) {
        return response.unauthorized('auth.invalidToken', res, false);
      }

      const user = await UserResources.getOneByColumnNameAndValue('id', userId);

      if (!user) {
        return response.unauthorized('error.userNotFound', res, false);
      }

      if (!user?.auth_token || user.auth_token !== token) {
        return response.unauthorized('auth.tokenMismatch', res, false);
      }

      if (roleToValidate) {
        const validRoles:string[] = [UserResources.roles.ADMIN, UserResources.roles.USER];
        if (!validRoles.includes(roleToValidate) || user.role !== roleToValidate) {
          return response.badRequest('auth.unauthorizedRole', res, false);
        }
      }

      if (user.status !== UserResources.statuses.ACTIVE) {
        const errorMessage = res.__('auth.accountBlocked', { supportEmail: process.env.SUPPORT_MAIL||"" });
        return response.unauthorized(errorMessage, res, false);
      }

      req.user = user;
      next();

    } catch (error: any) {
      return response.unauthorized(error.message, res, false);
    }
  };
};

export { auth };
