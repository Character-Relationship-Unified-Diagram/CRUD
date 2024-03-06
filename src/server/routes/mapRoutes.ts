import express, { Request, Response } from 'express';
import mapController from '../controllers/mapController';

const Router = express.Router();

Router.get('/get-maps', mapController.fetchCurrentUserMaps, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.maps_info);
});

Router.post('/create-map', mapController.createMap, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.map);
});

export default Router;
