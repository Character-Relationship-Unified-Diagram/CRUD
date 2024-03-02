import express, { Request, Response } from 'express';
import userController from '../controllers/userController';

const Router = express.Router();

Router.get('/', userController.getUsers, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.users);
});

export default Router;
