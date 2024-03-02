import express, { Request, Response } from 'express';
import mapController from '../controllers/mapController';

const Router = express.Router();

Router.get('/', mapController.fetchCurrentUserMaps, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
});

export default Router;
