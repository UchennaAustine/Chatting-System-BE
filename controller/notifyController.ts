import { Request, Response } from "express";
import { status } from "../utils/status";
import notifyModel from "../model/notifyModel";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { notification } = req.body;

    if (notification !== "") {
      const info = await notifyModel.create({
        notification,
      });
      return res.status(status.CREATED).json({
        message: `Notication`,
        data: info,
      });
    } else {
      const url = "amqp://127.0.0.1.27107:5672";
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Notification Creation error:${error.message}`,
      info: error,
    });
  }
};
