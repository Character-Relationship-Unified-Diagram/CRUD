import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { query } from '../config/db.config';

class UserController {
    constructor() {
        this.createUser = this.createUser.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
    }

    private async getUserByUsername(username: string) {
        const existingUser = await query(`SELECT * FROM users WHERE username = $1`, [username]);
        return existingUser;
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        const currentTimestamp = new Date().toISOString();

        try {
            if (!username || !password) {
                return next({
                    log: 'Sign Up Failed: Username or password inputs are missing',
                    status: 401,
                    message: { err: 'Sign Up Failed: Username or password inputs are missing' }
                });
            }
            
            const existingUser = await this.getUserByUsername(username);

            if (existingUser.rowCount >= 1) {
                return next({
                    log: 'User already exists. Please make a new account.',
                    status: 401,
                    message: { err: 'User already exists. Please make a new account.' }
                });
            }

            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPass = await bcrypt.hash(password, salt);

            const values = [username, bcryptPass, currentTimestamp];
            const createUsersQuery = `INSERT INTO users (username, password, created_at) VALUES ($1, $2, $3) RETURNING *`;
            const newUser = await query(createUsersQuery, values);

            if (newUser.rows.length === 0) {
                return next({
                    log: 'No account found',
                    status: 401,
                    message: { err: 'An error occurred in UserController.createUser' }
                });
            }

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
                        res.locals.user = {user_id: existingUser.rows[0].user_id, username: existingUser.rows[0].username};
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
}

export default new UserController();