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
      const result = await pool.query(query, [userId]);
  
    
      const mapIds: string[] = result.rows.map((row: MapRow) => row.map_id);
  
      res.locals.mapIds = mapIds;
      return next();
    }

    async createMap(_req: Request, _res: Response, _next: NextFunction) {}
    
    async getMap(req: Request, res: Response, next: NextFunction) {
      const { mapID } = req.body;
  
      const query = `SELECT c.*, ca."attr_value", 
          json_agg(json_build_object('status_name', s."status_name", 'recipient', rec."character_name")) AS "statuses",
          f."faction_name"
      FROM "characters" c
      LEFT JOIN "char_attributes" ca ON c."character_id" = ca."char_id"
      LEFT JOIN "char_statuses" cs ON c."character_id" = cs."char_sender"
      LEFT JOIN "statuses" s ON cs."status_id" = s."status_id"
      LEFT JOIN "factions" f ON c."faction_id" = f."faction_id"
      LEFT JOIN "characters" rec ON cs."char_recipient" = rec."character_id"
      WHERE c."map_id" = $1
      GROUP BY c."character_id", ca."attr_value", f."faction_name";`;
  
      const result = await pool.query(query, [mapID]);
      res.locals.chars = result.rows;
  
      const factions: string[] = [];
  
      for (const char of res.locals.chars) {
          const faction = char.faction_name;
          if (!factions.includes(faction) && faction != null) {
              factions.push(faction);
          }
      }
  
      res.locals.factions = factions;

      const query2 = `SELECT fs.*, sender.faction_name AS sender_name, recipient.faction_name AS recipient_name, s.status_name
      FROM faction_statuses fs
      JOIN factions sender ON fs.faction_sender = sender.faction_id
      JOIN factions recipient ON fs.faction_recipient = recipient.faction_id
      JOIN statuses s ON fs.status_id = s.status_id
      JOIN characters c ON sender.faction_id = c.faction_id
      JOIN maps m ON c.map_id = m.map_id
      WHERE m.map_id = $1;`

      const result2 = await pool.query(query2, [mapID]);
      res.locals.factionStatuses = result2.rows;

      return next();
  }
    
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

