import "dotenv/config.js";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRoutes from './routes/api';

const app = express();
const port = process.env.port || 3000;
const prod = process.env.NODE_ENV === "production";

app.use(cookieParser());
app.use(morgan("tiny"));
app.use(cors({
  origin: `http://localhost:${port}`,
  credentials: true
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, prod ? "./" : "../../", "dist")));
app.use(express.static(path.join(__dirname, "../assets")));

app.get("/", (_req, res) => {
  return res.sendFile(
    path.join(__dirname, prod ? "" : "../../", "dist/index.html")
  );
});

app.use('/users', userRoutes);

app.use((_req: Request, res: Response) => res.sendStatus(404));

app.use((err: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🚀`);
});

export default app;
