import { RequestHandler } from 'express';

export default function catchAsyncErrors(handler: (...params: Parameters<RequestHandler>) => Promise<void>): RequestHandler {
    return (req, res, next) => {
        handler(req, res, next).catch(next);
    };
}
