import express, { RequestHandler } from 'express';
import { AddressInfo } from 'net';
import cors from 'cors';
import morgan from 'morgan';
import { config as envConfig } from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'os';
import { connect, disconnect } from 'mongoose';


envConfig();

if (cluster.isPrimary) {

    onExit(cleanUpWorkers);

    const cpuCount = Number(process.env.WORKERS ?? cpus().length);
    console.info(`Starting ${cpuCount} workers...`);
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

} else {

    onExit(cleanUpDatabase);

    const app = express();

    app.use(cors({
        origin: process.env.CORS_ORIGIN
    }));

    app.use(morgan('common'));

    const port = Number(process.env.SERVER_PORT);
    const host = process.env.SERVER_HOST ?? 'localhost';

    const server = app.listen(port, host, async () => {
        await connect(process.env.SERVER_DB ?? 'mongodb://root:example@db:27017/?authSource=admin&readPreference=primary&ssl=false');
        const { address, port } = server.address() as AddressInfo;
        console.info(`${cluster.worker!.id} Listening on ${address}:${port}`);
    });
}

function catchAsyncErrors(handler: (...params: Parameters<RequestHandler>) => Promise<void>): RequestHandler {
    return function (req, res, next) {
        handler(req, res, next).catch(next);
    };
}

function cleanUpWorkers() {
    for (const [, worker] of Object.entries(cluster.workers!)) {
        worker?.kill();
    }
}

async function cleanUpDatabase() {
    await disconnect();
}

function onExit(cb: (...args: unknown[]) => void) {
    const exitEvents = ['exit', 'SIGHUP', 'SIGINT', 'SIGINT', 'SIGTERM'];
    exitEvents.forEach(e => process.on(e, cb));
}
