import { Request, Response } from "express";
import { status } from "../utils/status";
import chatMessageModel from "../model/chatMessageModel";
import chatModel from "../model/chatModel";
import model from "../model/model";

export const createChatMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID, chatID } = req.params;
    const { message } = req.body;

    const user: any = await model.findById(authID);
    const chat: any = await chatModel.findById(chatID);

    const chatMessage = await chatMessageModel.create({
      authID,
      chatID,
      message,
    });

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
