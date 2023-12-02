import { Request, Response } from "express";
import { status } from "../utils/status";
import chatMessageModel from "../model/chatMessageModel";
import amqplib from "amqplib";

export const createChatMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID, chatID } = req.params;
    const { message } = req.body;

    const chatMessage = await chatMessageModel.create({
      authID,
      chatID,
      message,
    });

    // const URL: string =
    //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";

    const URL: string = "amqp://localhost:5672";
    const connect = await amqplib.connect(URL);
    const channel = await connect.createChannel();
    const queueName = "messages";

    await channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(chatMessage))
    );
    console.log(chatMessage);

    return res.status(status.CREATED).json({
      message: `Chat Message Creation`,
      data: chatMessage,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Chat Creation error:${error.message}`,
      info: error,
    });
  }
};

export const findChatMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { chatID } = req.params;

    const chatMessage = await chatMessageModel.find({ chatID });

    return res.status(status.OK).json({
      message: `read Message `,
      data: chatMessage,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Chat Creation error:${error.message}`,
      info: error,
    });
  }
};
