import { Request, Response } from "express";
import { status } from "../utils/status";
import chatModel from "../model/chatModel";
import model from "../model/model";
import amqplib from "amqplib";

export const createChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID, friendID } = req.params;

    const user: any = await model.findById(authID);
    const friend: any = await model.findById(friendID);

    const findUserFriend = user?.friend.some((el: any) => el === friendID);

    const findFriendFriend = friend?.friend.some((el: any) => el === authID);

    const existingChat = await chatModel.findOne({
      member: { $all: [authID, friendID] },
    });

    if (!existingChat) {
      if (findFriendFriend && findUserFriend) {
        const chat = await chatModel.create({
          member: [authID, friendID],
        });
        //sending to the index && notification
        const URL: string = "amqp://localhost:5672";
        const connect = await amqplib.connect(URL);
        const channel = await connect.createChannel();

        await channel.sendToQueue("info", Buffer.from(JSON.stringify(chat)));

        return res.status(status.CREATED).json({
          message: "Chat created successfully",
          data: chat,
        });
      } else {
        return res.status(status.FORBIDDEN).json({
          message: "You are not friends",
        });
      }
    } else {
      return res.status(status.FORBIDDEN).json({
        message: "Chat already exists",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Chat Creation error:${error.message}`,
      info: error,
    });
  }
};

export const findChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID } = req.params;

    const chat = await chatModel.find({
      member: {
        $in: [authID],
      },
    });
    return res.status(status.OK).json({
      message: `Chat has being found`,
      data: chat,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Find Chat error:${error.message}`,
      info: error,
    });
  }
};

export const findAllChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const chat = await chatModel.find();
    return res.status(status.OK).json({
      message: `All Chats`,
      data: chat,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Find Chat error:${error.message}`,
      info: error,
    });
  }
};

export const deleteChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { chatID } = req.params;

    const chat = await chatModel.findByIdAndDelete(chatID);

    const URL: string = "amqp://localhost:5672";
    const connect = await amqplib.connect(URL);
    const channel = await connect.createChannel();

    await channel.sendToQueue("info", Buffer.from(JSON.stringify(chat)));
    return res.status(status.OK).json({
      message: `Chat has being delete`,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `delete Chat error:${error.message}`,
      info: error,
    });
  }
};

export const findOneChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID, friendID } = req.params;

    const chat = await chatModel.findOne({
      member: {
        $all: [authID, friendID],
      },
    });
    return res.status(status.OK).json({
      message: `Chat Creation`,
      data: chat,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Getting Single Chat Error:${error.message}`,
      info: error,
    });
  }
};
