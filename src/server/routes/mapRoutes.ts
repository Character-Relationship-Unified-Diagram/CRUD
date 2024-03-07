import express, { Request, Response } from 'express';
import mapController from '../controllers/mapController';

const Router = express.Router();

// returns: array of objects (map_id, map_name)
// changing this to a post because a GET should not have a body
Router.post('/get-maps', mapController.fetchCurrentUserMaps, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.maps_info);
});

// returns: array of objects (map_id, owner_id, map_name)
Router.post('/create-map', mapController.createMap, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.map);
});

// returns: array of objects (character_id, char_name, faction_id, map_id, character_descriptior, attr_value)
Router.post('/create-character', mapController.createCharacter, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.character);
});

// changing this to a post because a GET should not have a body
Router.post('/getMap', mapController.getMap, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
})

export default Router;
