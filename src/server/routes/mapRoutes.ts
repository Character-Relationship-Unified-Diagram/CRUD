import express, { Request, Response } from 'express';
import mapController from '../controllers/mapController';

const Router = express.Router();

// returns: array of objects (map_id, map_name)
Router.get('/get-maps', mapController.fetchCurrentUserMaps, (_req: Request, res: Response) => {
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

Router.get('/getMap', mapController.getMap, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
});

// returns: array of objects (character_id, character_name, faction_id, map_id, character_descriptor, attr_value, statuses [{recipient, status_name}], faction_name)
Router.post('/create-char-relation', mapController.addCharacterRelationship, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.character_statuses)
});

export default Router;
