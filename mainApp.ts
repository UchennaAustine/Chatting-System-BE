import express, { Application, Response, Request } from "express";
import cors from "cors";
import auth from "./router/authRouter";
import chat from "./router/chatRouter";
import message from "./router/chatMessageRouter";

export const mainApp = (app: Application) => {
  try {
    app.use(cors());
    app.use(express.json());
    app.use("/api", auth);
    app.use("/api", message);
    app.use("/api", chat);
    app.get("/", (req: Request, res: Response) => {
      return res.status(200).json({
        message: "App is active",
      });
    });
  } catch (error: any) {
    console.log(error);
  }
};
