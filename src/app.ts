import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";

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

app.get("/", async (req: Request, res: Response) => {
  try {
    prisma.user
      .findMany()
      .then((users) => console.log("Current Users in DB:", users))
      .catch((err) => console.log("DB Fetch Error:", err));

    res.status(200).json({
      success: true,
      message: "Hello, World! FixItNow Server API is spinning safely.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Initial internal handshake broken" });
  }
});

export default app;
