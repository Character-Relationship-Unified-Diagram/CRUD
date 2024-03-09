import express, { Request, Response } from 'express';
import mapController from '../controllers/mapController';

const Router = express.Router();

// returns: array of objects (map_id, map_name)
// changing this to a post because a GET should not have a body
Router.get(
  '/get-maps',
  mapController.fetchCurrentUserMaps,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.maps_info);
  },
);
Router.patch(
  '/update-character-attributes',
  mapController.updateCharacterAttribute,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.updatedCharacter);
  },
);

// returns: array of objects (map_id, owner_id, map_name)
Router.post(
  '/create-map',
  mapController.createMap,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.map);
  },
);

// returns: array of objects (character_id, char_name, faction_id, map_id, character_descriptior, attr_value)
Router.post(
  '/create-character',
  mapController.createCharacter,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.character);
  },
);

// changing this to a post because a GET should not have a body
Router.post('/getMap', mapController.getMap, (_req: Request, res: Response) => {
  return res.status(200).json(res.locals);
});

Router.get(
  '/getPublicMap',
  mapController.getPublicMap,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  },
);

// returns: array of objects (character_id, character_name, faction_id, map_id, character_descriptor, attr_value, statuses [{recipient, status_name}], faction_name)
Router.post(
  '/create-character-relationship',
  mapController.addCharacterRelationship,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.character_statuses);
  },
);

Router.delete(
  '/delete-character',
  mapController.deleteCharacter,
  mapController.getMap,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  },
);

Router.delete(
  '/delete-character-relationship',
  mapController.deleteCharacterRelationship,
  mapController.getMap,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  },
);

export default Router;
