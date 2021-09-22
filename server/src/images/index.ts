import { Router, static as staticSrv } from 'express';
import { join } from 'path';

const imagesRouter = Router();

const root = join(process.cwd(), '/static/images');
imagesRouter.use(staticSrv(root, {}));

export default imagesRouter;
