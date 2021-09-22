import express from 'express';
import { AddressInfo } from 'net';
import cors from 'cors';
import morgan from 'morgan';
import { config as envConfig } from 'dotenv';
import cluster from 'cluster';
import { cpus } from 'os';
import { connect, disconnect } from 'mongoose';
import imagesRouter from './images';
import menuRouter from './menu';
import { initDb } from './connection';

envConfig();

if (cluster.isPrimary) {
    initMain();
} else {
    initWorker();
}

async function initMain() {
    onExit(cleanUpWorkers);

    await connect(String(process.env.DB_PATH));
    await initDb();
    await disconnect();

    const cpuCount = Number(process.env.WORKERS ?? cpus().length);
    // eslint-disable-next-line no-console
    console.info(`Starting ${cpuCount} workers...`);
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
}

async function initWorker() {
    onExit(cleanUpDatabase);

    await connect(String(process.env.DB_PATH));

    const app = express();

    app.use(cors({
        origin: process.env.CORS_ORIGIN
    }));
    app.use(morgan('common'));
    app.use('/images', imagesRouter);
    app.use('/menu', menuRouter);

    const serverPort = Number(process.env.SERVER_PORT);
    const host = String(process.env.SERVER_HOST);

    const server = app.listen(serverPort, host, () => {
        const { address, port } = server.address() as AddressInfo;
        // eslint-disable-next-line no-console
        console.info(`${cluster.worker?.id}\tListening on ${address}:${port}`);
    });
}

function cleanUpWorkers() {
    if (cluster.workers) {
        for (const [, worker] of Object.entries(cluster.workers)) {
            worker?.kill();
        }
    }
}

async function cleanUpDatabase() {
    await disconnect();
}

function onExit(cb: (...args: unknown[]) => void) {
    const exitEvents = [
        'exit',
        'SIGHUP',
        'SIGINT',
        'SIGINT',
        'SIGTERM'
    ];
    exitEvents.forEach((event) => process.on(event, cb));
}
