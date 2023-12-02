import express, { Application, Response, Request } from "express";
import cors from "cors";
import morgan from "morgan";
import auth from "./router/authRouter";
import chat from "./router/chatRouter";
import message from "./router/chatMessageRouter";
import notify from "./router/notifyRouter";
import { status } from "./utils/status";

export const mainApp = (app: Application) => {
  try {
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json());
    app.use("/api", auth);
    app.use("/api", message);
    app.use("/api", chat);
    app.use("/api", notify);
    app.get("/", (req: Request, res: Response) => {
      try {
        return res.status(status.OK).json({
          message: "App API is active",
        });
      } catch (error: any) {
        return res.status(status.BAD_REQUEST).json({
          message: `App API Error: ${error.message}`,
          source: error,
        });
      }
    });
  } catch (error: any) {
    console.log(error);
  }
};
