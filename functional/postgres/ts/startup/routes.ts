import express, { Application, Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const routes = express.Router();

async function walk(dir: string, fileList: string[] = []): Promise<string[]> {
    const files = await fs.readdir(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
            fileList = await walk(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

export default async function (app: Application): Promise<void> {
    const allFiles = await walk('routes');

    allFiles.forEach((file) => {
        const fileNameArray = file.split('.')[0];
        const splitPath = fileNameArray.split(path.sep);
        const routeName = splitPath[1] || '';

        console.log('Registering route:', routeName);
        const routeModule = require(path.resolve(fileNameArray));
        app.use(`/api/v1/${routeName}`, routeModule.default);
    });

    app.get('/', (req: Request, res: Response) => {
        return res.status(200).send({
            msg: 'Everything is working fine.',
            host: req.get('host'),
        });
    });

    app.use((req: Request, res: Response) => {
        return res.status(404).send({
            msg: `'${req.originalUrl}' is not a valid endpoint. Please check the request URL and try again.`,
        });
    });
}
