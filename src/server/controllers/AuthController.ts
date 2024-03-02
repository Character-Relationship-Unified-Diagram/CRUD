import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config.js";

class AuthenticationController {
    public async createCookie(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('made it first line');
            if (req.cookies.SSID) res.clearCookie("SSID");
            const user_id = res.locals.user_id;

            const jToken = jwt.sign({ user_id }, process.env.JWT_SECRET as Secret, { expiresIn: "1h" });

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

    public async verifyCookie(req: Request, res: Response, next: NextFunction) {
        try {
            const jToken = req.cookies.SSID;

            if (!jToken) {
                return next({
                    log: "Unauthorized: Token not provided",
                    status: 401,
                    message: { error: "Error in AuthenticationController.verifyCookie" },
                });
            }

            jwt.verify(jToken, process.env.JWT_SECRET as Secret, (err: any, _decoded: any) => {
                if (err) {
                    res.locals.verified = false;
                    return next();
                } else {
                    res.locals.verified = true;
                    return next();
                }
            });
        } catch (error) {
            return next({
                log: "Error occurred in verifying the cookie",
                status: 500,
                message: { error: "Error in AuthenticationController.verifyCookie" },
            });
        }
    }

    public async clearCookie(_req: Request, res: Response, next: NextFunction) {
        try {
            if (res.locals.verified) {
                await res.clearCookie("SSID");
            } else {
                return next({
                    log: "Error occurred in clearing the cookie",
                    status: 404,
                    message: { error: "Error in AuthenticationController.clearCookie" },
                }); 
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