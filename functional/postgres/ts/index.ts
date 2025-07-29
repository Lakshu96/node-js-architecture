import express, { Application } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import { initSocket } from './services/socket';

import startup from './startup';
import './config/v1/postgres';

// Load environment variables
dotenv.config();
const app: Application = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;;
startup(app)

let server: http.Server | https.Server;

if (process.env.SSL_STATUS === 'true') {
  const keyPath = process.env.SSL_KEY_PEM_PATH;
  const certPath = process.env.SSL_CERT_PEM_PATH;

  if (!keyPath || !certPath) {
    throw new Error('SSL paths are not properly configured in environment variables');
  }

  const key = fs.readFileSync(keyPath, 'utf8');
  const cert = fs.readFileSync(certPath, 'utf8');

  const credentials = { key, cert };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

// Initialize socket.io
initSocket(server);

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
