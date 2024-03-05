import express, { Request, Response } from "express";
import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";

const Router = express.Router();

// auth portion
Router.post("/signup", UserController.createUser, (_req: Request, res: Response) => {
    return res.status(200).redirect("/home");
});

// returns: object {user_id (string), username (string)}
Router.route("/login").post(UserController.verifyUser, AuthController.createCookie, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.user);
});

// returns: object { username (string) }
Router.route("/verifyUser").get(AuthController.authenticateUser, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.username);
});

Router.route("/logout").post(AuthController.clearCookie, (_req: Request, res: Response) => {
    return res.status(200).redirect("/home");
});

// homepage portion
// Router.route("/").get(UserController.getUsers, (_req: Request, res: Response) => {
//     return res.status(200).json(res.locals.users);
// });

export default Router;
