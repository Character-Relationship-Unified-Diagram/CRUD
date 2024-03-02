import { NextFunction, Request, Response } from "express";

const pool = require('../config/db.config.ts');

interface MapRow {
    map_id: string;
  }

class MapController {
    async fetchCurrentUserMaps(req: Request, res: Response, next: NextFunction) {


        const query = `
        SELECT maps.map_id
        FROM maps
        WHERE maps.owner_id = $1
      `;
      const userId = req.body.userId;
      // Execute the query
      const result = await pool.query(query, [userId]);
  
    
      const mapIds: string[] = result.rows.map((row: MapRow) => row.map_id);
  
      res.locals.mapIds = mapIds;
      return next();
    }

    async createMap(_req: Request, _res: Response, _next: NextFunction) {}
    
    async getMap(_req: Request, _res: Response, _next: NextFunction) {}
    
    async createCharacter(_req: Request, _res: Response, _next: NextFunction) {}
    
    async deleteCharacter(_req: Request, _res: Response, _next: NextFunction) {}
    
    async updateCharacterAttribute(_req: Request, _res: Response, _next: NextFunction) {}
    
    async addCharacterRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async editCharacterRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async deleteCharacterRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async addFactionRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async editFactionRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    
    async deleteFactionRelationship(_req: Request, _res: Response, _next: NextFunction) {}
    }

export default new MapController();

