import { NextFunction, Request, Response } from "express";
import { query } from '../config/db.config';

interface MapRow {
    map_id: string;
}

class MapController {
    public async fetchCurrentUserMaps(req: Request, res: Response, next: NextFunction) {
      try {
        const userMapsQuery = `
        SELECT m.map_id, m.map_name
        FROM maps m
        INNER JOIN users u
        ON m.owner_id = u.user_id
        WHERE u.user_id = $1`;
  
        const user_id = req.user_id;
  
        const result = await query(userMapsQuery, [user_id]);  
  
        if (result.rows.length === 0) {
          return next({
            log: 'Failed to load maps from specified user',
            status: 401,
            message: { err: 'An error occurred in MapController.fetchCurrentUserMaps' }
          });
        }
  
        const maps_info: string[] = result.rows.map((row: MapRow) => row);
  
        res.locals.maps_info = maps_info;
        return next();
      } catch (error) {
        return next({
          log: `Error occurred in fetching current user's map`,
          status: 500,
          message: { err: `Error in MapController.fetchCurrentUserMaps` },
        });
      }
    }

    public async createMap(req: Request, res: Response, next: NextFunction) {
      const { map_name } = req.body;
      const owner_id = req.user_id;

      try {
        const createMapQuery = `INSERT INTO maps (owner_id, map_name) VALUES ($1, $2) RETURNING *`;
        const values = [owner_id, map_name];
        const result = await query(createMapQuery, values);

        if (result.rows.length === 0) {
          return next({
            log: 'Failed to create map',
            status: 401,
            message: { err: 'An error occurred in MapController.createMap' }
          });
        }

      res.locals.map = result.rows;
      return next();
      } catch (error) {
        return next({
          log: 'Error occurred in creating the map',
          status: 500,
          message: { err: `Error in MapController.createMap` },
        });
      }
    }
        
    public async createCharacter(req: Request, res: Response, next: NextFunction) {
      const { character_name, character_descriptor, faction_name, map_id } = req.body;
      let faction_id;	

      try {
        const checkFactionExists = `
        SELECT f.faction_id 
        FROM factions f
        WHERE f.faction_name ILIKE '%' || $1 || '%';
        `;

        const existingFaction = await query(checkFactionExists, [faction_name]);

      if (existingFaction.rowCount >= 1) {
        faction_id = existingFaction.rows[0].faction_id;
      } else {
        const createFactionQuery = `
          INSERT INTO factions
          (faction_name)
          VALUES ($1)
          RETURNING *
        `;

        const newFaction = await query(createFactionQuery, [faction_name]);

        if (newFaction.rows.length === 0) {
          return next({
            log: 'Failed to create faction for character',
            status: 401,
            message: { err: 'An error occurred in MapController.createCharacter' }
          });
        }

        faction_id = newFaction.rows[0].faction_id;
      }

      const createCharQuery = `
        INSERT INTO characters
        (character_name, faction_id, map_id, character_descriptor)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [character_name, faction_id, map_id, character_descriptor];
      const result = await query(createCharQuery, values);

      if (result.rows.length === 0) {
        return next({
          log: 'Failed to create character',
          status: 401,
          message: { err: 'An error occurred in MapController.createCharacter' }
        });
      }

      res.locals.character = result.rows;
      return next();
      } catch (error) {
        return next({
          log: 'Error occurred in creating the character and/or faction',
          status: 500,
          message: { err: `Error in MapController.createCharacter` },
        }); 
      }
    }

    async getMap(_req: Request, _res: Response, _next: NextFunction) {}
    
    async deleteCharacter(_req: Request, _res: Response, _next: NextFunction) {}
    
    async updateCharacterAttribute(_req: Request, _res: Response, _next: NextFunction) {}
    
    async addCharacterRelationship(_req: Request, _res: Response, _next: NextFunction) {
      
    }
    
    async editCharacterRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async deleteCharacterRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async addFactionRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async editFactionRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async deleteFactionRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    }

export default new MapController();

