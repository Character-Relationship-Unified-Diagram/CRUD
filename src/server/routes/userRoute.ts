import express, { Request, Response } from "express";
import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";

const Router = express.Router();

// auth portion
Router.post("/signup", UserController.createUser, (_req: Request, res: Response) => {
    return res.status(200).redirect("/home");
});

Router.route("/login").post(UserController.verifyUser, AuthController.createCookie, (_req: Request, res: Response) => {
    return res.sendStatus(200);
});

Router.route("/verifyUser").get(AuthController.verifyCookie, (_req: Request, res: Response) => {
    return res.sendStatus(200);
});

Router.route("/logout").post(AuthController.verifyCookie, AuthController.clearCookie, (_req: Request, res: Response) => {
    return res.sendStatus(200).redirect('/home');
});

// homepage portion
Router.route("/").get(UserController.getUsers, (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.users);
});

export default Router;
