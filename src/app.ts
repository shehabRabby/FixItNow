import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { UserRoutes } from "./app/modules/user/user.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/auth", AuthRoutes);




app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Hello, World! FixItNow Server API is spinning safely.",
  });
});

// Middleware Layer
app.use(globalErrorHandler);

export default app;
