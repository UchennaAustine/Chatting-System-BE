import { Request, Response } from "express";
import { status } from "../utils/status";
import notifyModel from "../model/notifyModel";
import amqplib from "amqplib";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { notification } = req.body;

    if (notification !== "") {
      const info = await notifyModel.create({
        notification,
      });
      // const url =
      //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";
      const amqpServer: string = "amqp://localhost:5672";
      const connect = await amqplib.connect(amqpServer);
      const channel = await connect.createChannel();
      await channel.sendToQueue("send", Buffer.from(JSON.stringify(info)));

      return res.status(status.CREATED).json({
        message: `Notication`,
        data: info,
      });
    } else {
      // const url =
      //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";
      const amqpServer = "amqp://localhost:5672";
      let newData: any = [];

      const connect = await amqplib.connect(amqpServer);
      const channel = await connect.createChannel();
      const queueName = "messages";
      await channel.assertQueue(queueName).then((res: any) => {
        console.log("connected", res);
      });

      await channel.consume(queueName, async (res: any) => {
        newData.push(await JSON.parse(res?.content.toString()));

        await channel.sendToQueue("send", Buffer.from(JSON.stringify(res)));

        await notifyModel.create({
          notification: res,
        });
        await channel.ack(res);
      });

      return res.status(status.CREATED).json({
        message: "New Notification",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Notification Creation error:${error.message}`,
      info: error,
    });
  }
};

export const readNotification = async (req: Request, res: Response) => {
  try {
    const notifications = await notifyModel.find();

    return res.status(status.OK).json({
      message: `Messages: ${notifications?.length}`,
      data: notifications,
    });
  } catch (error) {
    return res.status(status.BAD_REQUEST).json({
      message: "Error Reading Notifications",
    });
  }
};

export const deleteOneNotification = async (req: Request, res: Response) => {
  try {
    const { notifyID } = req.params;
    await notifyModel.findByIdAndDelete(notifyID);

    return res.status(status.OK).json({
      message: `Notification has being deleted:`,
    });
  } catch (error) {
    return res.status(status.BAD_REQUEST).json({
      message: "Error",
    });
  }
};
export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    // Delete all notifications
    await notifyModel.deleteMany();

    return res.status(status.OK).json({
      message: "Notifications have been deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(status.BAD_REQUEST).json({
      message: "Error deleting notifications",
    });
  }
};
