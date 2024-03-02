import { NextFunction, Request, Response } from "express";

const pool = require('../config/db.config.ts');

class UserController {
    async getUsers(_req: Request, res: Response, next: NextFunction) {
            const getUsersQuery = `SELECT * FROM owners`;
        
            try {
                const result = await pool.query(getUsersQuery);
                if (result.rows.length === 0) {
                    return next({
                        log: 'Error occured in userController.getUsers',
                    status: 404,
                    message: { err: 'An error occurred in userController.getUsers' },
                    });
                }
                res.locals.users = result.rows;
                return next();
            } catch (error) {
                return next({
                    log: 'Error occured in userController.getUsers',
                    status: 500,
                    message: { err: 'An error occurred in userController.getUsers' },
                });
            }
        }
    }

export default new UserController();

