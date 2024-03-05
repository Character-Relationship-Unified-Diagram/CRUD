import express, { Request, Response } from "express";
import UserController from "../controllers/userController";
import AuthController from "../controllers/AuthController";

const Router = express.Router();

// auth portion
Router.post("/signup", UserController.createUser, (_req: Request, res: Response) => {
    return res.status(200).redirect("/");
});

// returns: object {user_id (string), username (string)}
Router.post("/login", UserController.verifyUser, AuthController.createCookie, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.user);
});

// returns: object { username (string) }
Router.get("/verifyUser", AuthController.authenticateUser, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.username);
});

Router.post("/logout", AuthController.clearCookie, (_req: Request, res: Response) => {
    return res.status(200).redirect("/");
});

export default Router;
