import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
// import pool from '../config/db.config';
const pool = require('../config/db.config');

class UserController {
    constructor() {
        this.createUser = this.createUser.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
    }

    private async getUserByUsername(username: string) {
        const existingUser = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        console.log(existingUser, 'existing');
        return existingUser;
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        const currentTimestamp = new Date().toISOString();

        console.log('passed');
        try {
            if (!username || !password) {
                return next({
                    log: 'Sign Up Failed: Username or password inputs are missing',
                    status: 401,
                    message: { err: 'Sign Up Failed: Username or password inputs are missing' }
                });
            }

            console.log('passed1');
            console.log('user:', username);
            
            const existingUser = await this.getUserByUsername(username);
            console.log('passed 2');

            if (existingUser.rowCount >= 1) {
                return next({
                    log: 'User already exists. Please make a new account.',
                    status: 401,
                    message: { err: 'User already exists. Please make a new account.' }
                });
            }
            console.log('passed3');

            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPass = await bcrypt.hash(password, salt);

            console.log('passed4');

            const values = [username, bcryptPass, currentTimestamp];
            const createUsersQuery = `INSERT INTO users (username, password, created_at) VALUES ($1, $2, $3) RETURNING *`;
            const newUser = await pool.query(createUsersQuery, values);

            console.log('passed5');

            if (newUser.rows.length === 0) {
                return next({
                    log: 'No account found',
                    status: 401,
                    message: { err: 'An error occurred in UserController.createUser' }
                });
            }

            console.log('passed6');

            res.locals.user = newUser;
            return next();
        } catch (error) {
            return next({
                log: 'Error occurred in creating the user',
                status: 500,
                message: { err: `Error in UserController.createUser` },
            });
        }
    }

    public async verifyUser(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;

        try {
            if (!username || !password) {
                return next({
                    log: 'Login Failed: Username or password inputs are missing',
                    status: 401,
                    message: { err: 'Login Failed: Username or password inputs are missing' }
                });
            }

            const existingUser = await this.getUserByUsername(username);

            if (existingUser.rowCount === 0) {
                return res.redirect('/signup');
            };

            bcrypt
                .compare(password, existingUser.rows[0].password)
                .then((result) => {
                    if (!result) {
                        return next({
                            log: 'Verification Failed: Incorrect username or password',
                            status: 401,
                            message: { err: 'Verification Failed: Incorrect username or password' }
                        });
                    } else {
                        res.locals.user_id = existingUser.rows[0].user_id;
                        return next();
                    }
                });
        } catch (error) {
            return next({
                log: 'Error occurred verifying the user',
                status: 500,
                message: { err: 'Error in UserController.verifyUser' },
            });
        }
    }

    public async getUsers(_req: Request, res: Response, next: NextFunction) {
        const getUsersQuery = `SELECT * FROM users`;

        try {
            const result = await pool.query(getUsersQuery);
            if (result.rows.length === 0) {
                return next({
                    log: 'No existing users',
                    status: 404,
                    message: { err: 'An error occurred in UserController.getUsers' },
                });
            }

            res.locals.users = result.rows;
            return next();
        } catch (error) {
            return next({
                log: 'Error occured in UserController.getUsers',
                status: 500,
                message: { err: 'An error occurred in UserController.getUsers' },
            });
        }
    }
}

export default new UserController();