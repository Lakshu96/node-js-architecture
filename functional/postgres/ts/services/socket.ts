import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import i18n from '../config/v1/i18n';
import * as UserResources from '../resources/v1/users/users.resources';
import { UserAttributes } from '@/resources/v1/users/user.model';

// Optional: import redis if you’re using it
// import * as redis from './redis';

const userKeyPrefix = 'user_';

// Wrap jwt.verify into a Promise for better async/await support
const verifyToken = (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_TOKEN_KEY as string, (err, decoded) => {
      if (err || !decoded) {
        return reject(err || new Error('Invalid token'));
      }
      resolve(decoded as JwtPayload);
    });
  });
};

const success = (msg: string, data?: any) => {
  return {
    api_ver: process.env.API_VER,
    status: 'success',
    message: i18n.__(msg),
    data,
  };
};

const error = (msg: string) => {
  return {
    api_ver: process.env.API_VER,
    status: 'error',
    message: i18n.__(msg),
  };
};

export const initSocket = (httpServer: HttpServer): void => {
  const socketConfig = {
    path: '/api/v1/connect',
    cors: {
      methods: '*',
    },
  };

  const io = new Server(httpServer, socketConfig);

  if (!io) {
    throw new Error('Socket.io not initialized');
  }

  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.headers['authorization'];

    if (!token) {
      return next(new Error(i18n.__('socket.noToken')));
    }

    try {
      const decoded = await verifyToken(token);
      const userId = (decoded as any).user_id;

      const user = await UserResources.getOneByColumnNameAndValue('id', userId) as UserAttributes;

      if (!user) {
        return next(new Error(i18n.__('socket.noUserFound')));
      }

      if (!user.auth_token || user.auth_token !== token) {
        return next(new Error(i18n.__('socket.tokenMismatch')));
      }

      // Attach user to socket
      (socket as any).user = user;

      next();
    } catch (err) {
      return next(new Error(i18n.__('socket.invalidToken')));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const user = (socket as any).user as any;
    const userId = user?.id;
    const userKey = userKeyPrefix + userId;

    // Optional Redis Logic
    // const hasUpdated = await redis.setKey(userKey, socket.id);
    // if (!hasUpdated) {
    //   socket.emit('error', error("socket.serverError"));
    // } else {
    //   socket.emit('success', success("socket.keySaved"));
    // }

    socket.on('disconnect', async () => {
      // Optional: await redis.clearKey(userKey);
    });

    socket.on('test', async (data: any, callback: Function) => {
      io.to(socket.id).emit('test', success('socket.testEvent', data));
    });
  });
};
