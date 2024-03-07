import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
    interface Request {
        user_id?: string;
    }
}

export function extractUserInfoFromToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.SSID;
    if (token) {
        try {
            const tokenBody = jwt.decode(token, {complete: true}) as JwtPayload;
            if (tokenBody && tokenBody.payload && tokenBody.payload.user_id && typeof tokenBody.payload.user_id === 'string') {
                req.user_id = tokenBody.payload.user_id
            }
        } catch (error) {
            return next({
                log: "Error occurred in extracting user info from cookie",
                status: 500,
            });
        }
    }
    return next();
}