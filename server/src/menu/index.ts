import { Router } from 'express';
import getAllMenuItems from './getAllMenuItems';
import catchAsyncErrors from '../shared/catchAsyncErrors';

const menuRouter = Router();

menuRouter.get('/', catchAsyncErrors(async (_req, res) => {
    res.json(await getAllMenuItems());
}));

export default menuRouter;
