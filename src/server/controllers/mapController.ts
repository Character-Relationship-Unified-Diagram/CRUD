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

      const result = await query(query1, [pubID]);
      res.locals.chars = result.rows;

      const query2 = `SELECT fs.*
      FROM factions f
      JOIN faction_statuses fs ON f.faction_id = fs.faction_sender
      WHERE f.map_id = $1;`;

      const result2 = await query(query2, [pubID]);
      console.log(result2.rows);
      res.locals.factionStatuses = result2.rows;

      const query3 = `SELECT f.faction_name, f.faction_id
      FROM factions f
      WHERE f.map_id = $1;`;

      const result3 = await query(query3, [pubID]);
      console.log(result3.rows);
      res.locals.factions = result3.rows.map(
        (faction: { faction_name: string; faction_id: string }) => {
          {
            return {
              faction_name: faction.faction_name,
              faction_id: faction.faction_id,
            };
          }
        },
      );

      return next();
    } catch (error) {
      console.error('Error fetching  map:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteMap(req: Request, res: Response, next: NextFunction) {
    try {
      const { mapID } = req.body;

      console.log(mapID);
      await query(
        'DELETE FROM char_statuses WHERE char_sender IN (SELECT character_id FROM characters WHERE map_id = $1) OR char_recipient IN (SELECT character_id FROM characters WHERE map_id = $1)',
        [mapID],
      );

      await query(
        'DELETE FROM faction_statuses WHERE faction_sender IN (SELECT faction_id FROM factions WHERE map_id = $1) OR faction_recipient IN (SELECT faction_id FROM factions WHERE map_id = $1)',
        [mapID],
      );

      await query('DELETE FROM factions WHERE map_id = $1', [mapID]);

      await query(
        'DELETE FROM char_attributes WHERE char_id IN (SELECT character_id FROM characters WHERE map_id = $1)',
        [mapID],
      );

      await query('DELETE FROM characters WHERE map_id = $1', [mapID]);

      await query('DELETE FROM maps WHERE map_id = $1', [mapID]);

      return next();
    } catch (error) {
      return next({
        log: 'Error occurred in deleting map',
        status: 500,
        message: { err: `Error in MapController.deleteCharacter` },
      });
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
      console.log(char_result.rows);

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
      console.log(attr_result.rows);

      const gatherCharInfo = `
      SELECT c.*, ca."attr_value"
      FROM "characters" c
      LEFT JOIN "char_attributes" ca ON c."character_id" = ca."char_id"
      WHERE c."character_id" = $1 AND c."map_id" = $2;`;

      console.log(char_id, map_id); // map_id is undefined

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


      const query2 = `SELECT DISTINCT
      fs.faction_stat_id,
      fs.status_id,
      fs.faction_sender,
      fs.faction_recipient,
      sender.faction_name AS sender_name,
      recipient.faction_name AS recipient_name,
      s.status_name
      FROM faction_statuses fs
      JOIN statuses s ON fs.status_id = s.status_id
      JOIN factions sender ON fs.faction_sender = sender.faction_id AND sender.map_id = $1
      JOIN factions recipient ON fs.faction_recipient = recipient.faction_id AND recipient.map_id = $1
  `;

      const result2 = await query(query2, [mapID]);
      res.locals.factionStatuses = result2.rows;

      const query3 = `
      SELECT DISTINCT f.*
      FROM factions f
      WHERE f.map_id = $1;
      `;

      const result3 = await query(query3, [mapID]);
      console.log(result3.rows);
      res.locals.factions = result3.rows.map(
        (faction: { faction_name: string; faction_id: string }) => {
          {
            return {
              faction_name: faction.faction_name,
              faction_id: faction.faction_id,
            };
          }
        },
      );

      return next();
    } catch (error) {
      console.error('Error fetching  map:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteCharacter(req: Request, res: Response, next: NextFunction) {
    const { characterID } = req.body;
    try {
      await query(
        'DELETE FROM "char_statuses" WHERE "char_sender" = $1 OR "char_recipient" = $1',
        [characterID],
      );
      await query('DELETE FROM "characters" WHERE "character_id" = $1', [
        characterID,
      ]);

      return next();
    } catch (error) {
      console.error('Error deleting character:', error);
      res.status(500).json({ message: 'Error deleting character.' });
    }
  }

  async updateCharacterAttribute(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { characterID, newAttributes, newDescriptor } = req.body;

      // update attrs
      const updateQuery = `
            UPDATE char_attributes
            SET attr_value = $1
            WHERE char_id = $2
            RETURNING *
        `;
      const updateResult = await query(updateQuery, [
        newAttributes,
        characterID,
      ]);
      //update desc
      const updateQueryDesc = `
        UPDATE characters
        SET character_descriptor = $1
        WHERE character_id = $2
        RETURNING *
    `;
      const updateResult2 = await query(updateQueryDesc, [
        newDescriptor,
        characterID,
      ]);

      const characterQuery = `
            SELECT c.*, ca.*
            FROM characters c
            LEFT JOIN char_attributes ca ON c.character_id = ca.char_id
            WHERE c.character_id = $1
        `;
      const characterResult = await query(characterQuery, [characterID]);

      const updatedCharacter = characterResult.rows[0];

      res.locals.updatedCharacter = updatedCharacter;

      return next();
    } catch (error) {
      console.error('Error updating character attributes:', error);
      return next(error);
    }
  }

  async addCharacterRelationship(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { char_recipient, char_sender, status_name } = req.body;
    let status_id;
    console.log(char_recipient, char_sender, status_name);
    console.log('hiiii');
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
          message: {
            err: 'An error occurred in MapController.addCharacterRelationship',
          },
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

      const result = await query(getCharRelationshipsQuery, [
        char_sender,
        char_recipient,
      ]);

      if (result.rows.length === 0) {
        return next({
          log: 'Failed to get characters with relationships',
          status: 500,
          message: {
            err: 'An error occurred in MapController.addCharacterRelationship',
          },
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
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const { mapID, status_name, char_sender, char_recipient } = req.body;
    console.log(mapID, status_name, char_sender, char_recipient);
    try {
      const deleteCharRelationQuery = `
      DELETE FROM char_statuses cs
      USING statuses s, maps m
      WHERE 
        (cs.char_sender = $1 AND cs.char_recipient = $2)
        OR
        (cs.char_sender = $2 OR cs.char_recipient = $1)
      AND s.status_name = $3
      AND cs.status_id = s.status_id
      AND m.map_id = $4
      `;

      const values = [char_sender, char_recipient, status_name, mapID];

      await query(deleteCharRelationQuery, values);

      // if (result.rows.length === 0) {
      //   return next({
      //     log: 'Could not find existing character relationship',
      //     status: 404,
      //     message: {
      //       err: `Error in MapController.deleteCharacterRelationship`,
      //     },
      //   });
      // }

      return next();
    } catch (error) {
      return next({
        log: 'Error occurred in deleting the haracter relationship',
        status: 500,
        message: { err: `Error in MapController.deleteCharacterRelationship` },
      });
    }
  }
  async addFactionRelationship(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { faction_sender, faction_recipient, status_name } = req.body;
    try {
      
      const getStatusIdQuery = `
        SELECT status_id FROM statuses WHERE status_name = $1
      `;
      const statusIdResult = await query(getStatusIdQuery, [status_name]);
      if (statusIdResult.rows.length === 0) {
        return next({
          log: 'Failed to retrieve status ID',
          status: 400, 
          message: {
            err: 'Status name not found in the database',
          },
        });
      }
      const status_id = statusIdResult.rows[0].status_id;
  
      const createFactionRelationshipQuery = `
        INSERT INTO faction_statuses
        (faction_sender, faction_recipient, status_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
  
      const factionRelationValues = [
        faction_sender,
        faction_recipient,
        status_id,
      ];
  
      const factionRelationResult = await query(
        createFactionRelationshipQuery,
        factionRelationValues,
      );
  
      if (factionRelationResult.rows.length === 0) {
        return next({
          log: 'Failed to create faction relationship',
          status: 500,
          message: {
            err: 'An error occurred in MapController.addFactionRelationship',
          },
        });
      }
  
      res.locals.faction_relationship = factionRelationResult.rows;
      return next();
    } catch (error) {
      return next({
        log: 'Error occurred in creating the faction relationship',
        status: 500,
        message: { err: `Error in MapController.addFactionRelationship` },
      });
    }
  }
  

  async createFaction(req: Request, res: Response, next: NextFunction) {
    const { faction_name, map_id } = req.body;

    try {
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
      console.log(newFaction.rows);

      if (newFaction.rows.length === 0) {
        return next({
          log: 'Failed to create faction',
          status: 401,
          message: { err: 'An error occurred in MapController.createFaction' },
        });
      }

      res.locals.faction = newFaction.rows;
      return next();
    } catch (error) {
      return next({
        log: 'Error occurred in creating the faction',
        status: 500,
        message: { err: `Error in MapController.createFaction` },
      });
    }
  }

  async editFactionRelationship(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ) {}

  async deleteFactionRelationship(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { faction_stat_id } = req.body;

      await query('DELETE FROM faction_statuses WHERE faction_stat_id = $1', [
        faction_stat_id,
      ]);

      res.locals.message = 'faction relationship deleted!';
      return next();
    } catch (error) {
      console.error('Error deleting faction relationship:', error);

      return next({
        log: 'Error occurred in deleting the faction relationship',
        status: 500,
        message: { err: `Error in MapController.deleteFactionRelationship` },
      });
    }
  }

  async deleteFaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { faction_id } = req.body;

      await query(
        'UPDATE characters SET faction_id = NULL WHERE faction_id = $1',
        [faction_id],
      );
      await query(
        'DELETE FROM faction_statuses WHERE faction_sender = $1 OR faction_recipient = $1',
        [faction_id],
      );
      await query('DELETE FROM factions WHERE faction_id = $1', [faction_id]);

      return next();
    } catch (error) {
      return next({
        log: 'Error occurred in deleting faction!',
        status: 500,
        message: { err: `Error in MapController.deleteFaction` },
      });
    }
  }
}

export default new MapController();
