import { NextFunction, Request, Response } from 'express';
import { query } from '../config/db.config';

interface MapRow {
  map_id: string;
}

class MapController {
  public async fetchCurrentUserMaps(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userMapsQuery = `
        SELECT m.map_id, m.map_name
        FROM maps m
        INNER JOIN users u
        ON m.owner_id = u.user_id
        WHERE u.user_id = $1
        `;
  
        const user_id = req.user_id;
  
        const result = await query(userMapsQuery, [user_id]);  
  
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
          message: { err: 'An error occurred in MapController.createMap' },
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
  async getPublicMap(req: Request, res: Response, next: NextFunction) {
    try {
        const { pubID } = req.query;

        const query1 = `
            SELECT c.*, ca."attr_value", 
            json_agg(json_build_object('status_name', s."status_name", 'recipient', rec."character_name")) AS "statuses", f."faction_name"
            FROM "characters" c
            LEFT JOIN "char_attributes" ca ON c."character_id" = ca."char_id"
            LEFT JOIN "char_statuses" cs ON c."character_id" = cs."char_sender"
            LEFT JOIN "statuses" s ON cs."status_id" = s."status_id"
            LEFT JOIN "factions" f ON c."faction_id" = f."faction_id"
            LEFT JOIN "characters" rec ON cs."char_recipient" = rec."character_id"
            WHERE c."map_id" = (SELECT "map_id" FROM "maps" WHERE "pub_id" = $1)
            GROUP BY c."character_id", ca."attr_value", f."faction_name";
        `;

        const result = await query(query1, [pubID]);
        res.locals.chars = result.rows;

        const factions: string[] = [];

        for (const char of res.locals.chars) {
            const faction = char.faction_name;
            if (!factions.includes(faction) && faction != null) {
                factions.push(faction);
            }
        }

        res.locals.factions = factions;

        const query2 = `
            SELECT fs.*, sender.faction_name AS sender_name, recipient.faction_name AS recipient_name, s.status_name
            FROM faction_statuses fs
            JOIN factions sender ON fs.faction_sender = sender.faction_id
            JOIN factions recipient ON fs.faction_recipient = recipient.faction_id
            JOIN statuses s ON fs.status_id = s.status_id
            JOIN characters c ON sender.faction_id = c.faction_id
            JOIN maps m ON c.map_id = m.map_id
            WHERE m.map_id = (SELECT "map_id" FROM "maps" WHERE "pub_id" = $1);
        `;

        const result2 = await query(query2, [pubID]);
        res.locals.factionStatuses = result2.rows;

        return next();
    } catch (error) {
        // Handle errors
        console.error("Error fetching public map:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


  public async createCharacter(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const {
      character_name,
      character_descriptor,
      faction_name,
      map_id,
      attr_value,
    } = req.body;
    let faction_id;

    try {
      const checkFactionExists = `
        SELECT f.faction_id 
        FROM factions f
        WHERE f.faction_name ILIKE '%' || $1 || '%' AND f.map_id = $2;
        `;

      const existingFaction = await query(checkFactionExists, [
        faction_name,
        map_id,
      ]);

      if (existingFaction.rowCount >= 1) {
        faction_id = existingFaction.rows[0].faction_id;
      } else {
        const createFactionQuery = `
          INSERT INTO factions
          (faction_name, map_id)
          VALUES ($1, $2)
          RETURNING *
        `;

        const newFaction = await query(createFactionQuery, [
          faction_name,
          map_id,
        ]);

        if (newFaction.rows.length === 0) {
          return next({
            log: 'Failed to create faction for character',
            status: 401,
            message: {
              err: 'An error occurred in MapController.createCharacter',
            },
          });
        }

        faction_id = newFaction.rows[0].faction_id;
      }

      const createCharQuery = `
        INSERT INTO characters
        (character_name, faction_id, map_id, character_descriptor)
        VALUES ($1, $2, $3, $4)
        RETURNING character_id
      `;

      const values = [character_name, faction_id, map_id, character_descriptor];
      const char_result = await query(createCharQuery, values);

      if (char_result.rows.length === 0) {
        return next({
          log: 'Failed to create character',
          status: 401,
          message: {
            err: 'An error occurred in MapController.createCharacter',
          },
        });
      }

      const char_id = char_result.rows[0].character_id;

      const createCharAttributes = `
        INSERT INTO char_attributes
        (char_id, attr_value)
        VALUES ($1, $2)
        RETURNING *
      `;

      const attribute_values = [char_id, attr_value];
      const attr_result = await query(createCharAttributes, attribute_values);

      if (attr_result.rows.length === 0) {
        return next({
          log: 'Failed to create character attributes',
          status: 401,
          message: {
            err: 'An error occurred in MapController.createCharacter',
          },
        });
      }

      const gatherCharInfo = `
        SELECT c.*, ca.attr_value
        FROM characters c
        LEFT JOIN char_attributes ca
        ON c.character_id = ca.char_id
        WHERE c.character_id = $1 AND c.map_id = $2
      `;

      const result = await query(gatherCharInfo, [char_id, map_id]);

      if (result.rows.length === 0) {
        return next({
          log: 'Failed to get character with attributes',
          status: 500,
          message: {
            err: 'An error occurred in MapController.createCharacter',
          },
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

  async getMap(req: Request, res: Response, next: NextFunction) {
    try {
    const { mapID } = req.body;
    //! There's a very real risk of SQL injection here, just a heads up. This is due to the fact that you're passing in a raw string as the query, and then passing in the mapID as a parameter, which is coming from the request body
      //query sanitization someday - AA
    const query1 = `SELECT c.*, ca."attr_value", 
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

    const result = await query(query1, [mapID]);
    res.locals.chars = result.rows;

    const factions: string[] = [];

    for (const char of res.locals.chars) {
      const faction = char.faction_name;
      if (!factions.includes(faction) && faction != null) {
        factions.push(faction);
      }
    }

    res.locals.factions = factions;

    const query2 = `SELECT DISTINCT fs.*, sender.faction_name AS sender_name, recipient.faction_name AS recipient_name, s.status_name
      FROM faction_statuses fs
      JOIN factions sender ON fs.faction_sender = sender.faction_id
      JOIN factions recipient ON fs.faction_recipient = recipient.faction_id
      JOIN statuses s ON fs.status_id = s.status_id
      JOIN characters c ON sender.faction_id = c.faction_id
      JOIN maps m ON c.map_id = m.map_id
      WHERE m.map_id = $1;`;

    const result2 = await query(query2, [mapID]);
    res.locals.factionStatuses = result2.rows;

    return next();
  }
  catch (error) {
    console.error("Error fetching public map:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteCharacter(_req: Request, _res: Response, _next: NextFunction) {}

  async updateCharacterAttribute(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}

  async addCharacterRelationship(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { char_recipient, char_sender, status_name } = req.body;
    let status_id;

      try {
        const checkStatusExists = `
        SELECT s.status_id
        FROM statuses s
        WHERE s.status_name ILIKE '%' || $1 || '%';
        `;

      const existingStatus = await query(checkStatusExists, [status_name]);

      if (existingStatus.rowCount >= 1) {
        status_id = existingStatus.rows[0].status_id;
      } else {
        const createStatusQuery = `
          INSERT INTO statuses
          (status_name)
          VALUES ($1)
          RETURNING *
        `;

        const newStatus = await query(createStatusQuery, [status_name]);

        if (newStatus.rows.length === 0) {
          return next({
            log: 'Failed to create status for character relationship',
            status: 401,
            message: {
              err: 'An error occurred in MapController.addCharacterRelationship',
            },
          });
        }
        status_id = newStatus.rows[0].status_id;
      }

      const createCharacterRelationshipQuery = `
        INSERT INTO char_statuses
        (status_id, char_sender, char_recipient)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const charRelationsValues = [status_id, char_sender, char_recipient];

      const charRelationResult = await query(
        createCharacterRelationshipQuery,
        charRelationsValues,
      );

      if (charRelationResult.rows.length === 0) {
        return next({
          log: 'Failed to create character relationship',
          status: 500,
          message: { err: 'An error occurred in MapController.addCharacterRelationship' }
         });
      }
    
    const getCharRelationshipsQuery = `
      SELECT c.*, ca."attr_value",
      json_agg(DISTINCT jsonb_build_object('status_name', s."status_name", 'recipient', rec."character_name")) AS "statuses",
      f."faction_name"
      FROM "characters" c
      LEFT JOIN "char_attributes" ca ON c."character_id" = ca."char_id"
      LEFT JOIN "char_statuses" cs ON c."character_id" = cs."char_sender"
      LEFT JOIN "statuses" s ON cs."status_id" = s."status_id"
      LEFT JOIN "factions" f ON c."faction_id" = f."faction_id"
      JOIN "characters" rec ON cs."char_recipient" = rec."character_id"
      WHERE (c."character_id" = $1 OR c."character_id" = $2)
      GROUP BY c."character_id", ca."attr_value", f."faction_name";
    `;

    const result = await query(getCharRelationshipsQuery, [char_sender, char_recipient]);

    if (result.rows.length === 0) {
        return next({
          log: 'Failed to get characters with relationships',
          status: 500,
          message: { err: 'An error occurred in MapController.addCharacterRelationship' }
        });
      }
      
      res.locals.character_statuses = result.rows;
      return next();
      } catch (err) {
        return next({
          log: 'Error occurred in creating the character relationship and/or status',
          status: 500,
          message: { err: `Error in MapController.addCharacterRelationship` },
        });
      } 
  }

  async editCharacterRelationship(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}

  async deleteCharacterRelationship(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}

  async addFactionRelationship(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}

  async editFactionRelationship(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}

  async deleteFactionRelationship(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}
}

export default new MapController();
