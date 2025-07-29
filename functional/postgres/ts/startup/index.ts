import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import errorHandler from '../middleware/v1/error';
import i18n from '../config/v1/i18n';

// Ensure these are TypeScript-compatible:
import setupRoutes from './routes';
import syncModels from './models';

const startup = async (app: Application): Promise<void> => {
    console.log('Loading startup files!');

    // Middleware to parse URL-encoded form data
    app.use(express.urlencoded({ extended: true }));

    // parse application/json
    app.use(express.json({ limit: '50mb' }));

    // Enable Cross-Origin Resource Sharing (CORS)
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        allowedHeaders: '*',
    }));

    // Secure HTTP headers
    app.use(helmet());

    // Initialize i18n middleware
    app.use(i18n.init);

    // Static file paths
    app.use('/public', express.static('public'));
    app.use('/uploads', express.static('uploads'));

    // Route setup
    await setupRoutes(app);

    // Sync models
    await syncModels();

    // Global error handler middleware
    app.use(errorHandler);
};

export default startup;
