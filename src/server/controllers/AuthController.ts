import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import "dotenv/config.js";

class AuthenticationController {
    public async createCookie(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.cookies.SSID) res.clearCookie("SSID");
            const user_id = res.locals.user.user_id;
            const username = res.locals.user.username;

            const jToken = jwt.sign({ user_id, username }, process.env.JWT_SECRET as Secret, { expiresIn: "1h" });

            res.cookie("SSID", jToken, { expires: new Date(Date.now() + 600_000), httpOnly: true });

            return next();
        } catch (error) {
            return next({
                log: "Error occurred creating the cookie",
                status: 500,
                message: { error: "Error in AuthenticationController.createCookie" },
            });
        }
    }

    public async authenticateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const jToken = req.cookies.SSID;

            if (!jToken) {
                return next({
                    log: "Unauthorized: Token not provided",
                    status: 401,
                    message: { error: "Error in AuthenticationController.verifyCookie" },
                });
            }

            const data = jwt.verify(jToken, process.env.JWT_SECRET as Secret) as JwtPayload;
            res.locals.username = {username: data.username};
            return next();
        } catch (error) {
            return next({
                log: "Error occurred in verifying the cookie",
                status: 500,
                message: { error: "Error in AuthenticationController.verifyCookie" },
            });
        }
    }

    public async clearCookie(req: Request, res: Response, next: NextFunction) {
        try {
            const jToken = req.cookies.SSID;

            if (jToken) {
                await res.clearCookie("SSID");
            }
            
            return next();
        } catch (error) {
            return next({
                log: "Error occurred in clearing the cookie",
                status: 500,
                message: { error: "Error in AuthenticationController.clearCookie" },
            });
        }
    }
}

export default new AuthenticationController();