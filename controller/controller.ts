import { Request, Response } from "express";
import { status } from "../utils/status";
import authModel from "../model/model";
import amqplib from "amqplib";

export const createAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userName, email, password } = req.body;

    const user = await authModel.create({
      userName,
      email,
      password,
    });

    return res.status(status.CREATED).json({
      message: `Registration`,
      data: user,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Registration error:${error.message}`,
      info: error,
    });
  }
};

export const findAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await authModel.find().sort({ userName: 1 });

    return res.status(status.OK).json({
      message: `All Users: ${user.length}`,
      data: user,
    });
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Getting All Users Error:${error.message}`,
      info: error,
    });
  }
};

export const findOneAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID } = req.params;

    const user = await authModel.findById(authID);

    if (user) {
      return res.status(status.OK).json({
        message: `User:${user?.userName}`,
        data: user,
      });
    } else {
      return res.status(status.NOT_FOUND).json({
        message: `Invalid user`,
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Getting Single User error:${error.message}`,
      info: error,
    });
  }
};

export const updateAuth = async (req: Request, res: Response) => {
  try {
    const { authID } = req.params;
    const { userName } = req.body;

    const user = await authModel.findById(authID);

    if (user) {
      const userUpdate = await authModel.findByIdAndUpdate(
        authID,
        { userName },
        { new: true }
      );

      const URL: string = "amqp://localhost:5672";
      const connect = await amqplib.connect(URL);
      const channel = await connect.createChannel();
      const queueName = "messages";
      await channel.assertQueue(queueName);
      await channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(userUpdate))
      );

      return res.status(status.OK).json({
        message: "Users' Info has Updated",
        data: userUpdate,
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Users' Info Update error:${error.message}`,
      info: error,
    });
  }
};

export const deleteAuth = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID } = req.params;

    const user = await authModel.findByIdAndDelete(authID);

    if (user) {
      return res.status(status.OK).json({
        message: "Delete",
      });
    } else {
      return res.status(status.FORBIDDEN).json({
        message: `Invalid user`,
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `find one error:${error.message}`,
      info: error,
    });
  }
};

export const makeFriend = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID, friendID } = req.params;

    const user: any = await authModel.findById(authID);
    const friend: any = await authModel.findById(friendID);

    if (user && friend) {
      if (user.friend.some((el: string) => el === friendID)) {
        return res.status(status.FORBIDDEN).json({
          message: "Already friends",
        });
      } else {
        let userPush = [...user.friend, friendID];
        let friendPush = [...friend.friend, authID];
        const makeFri = await authModel.findByIdAndUpdate(
          authID,
          { friend: userPush },
          { new: true }
        );
        const makeAuth = await authModel.findByIdAndUpdate(
          friendID,
          { friend: friendPush },
          { new: true }
        );

        const URL: string = "amqp://localhost:5672";
        const connect = await amqplib.connect(URL);
        const channel = await connect.createChannel();
        const queueName = "messages";

        await channel.sendToQueue(
          queueName,
          Buffer.from(JSON.stringify({ makeFri, makeAuth }))
        );

        return res.status(status.OK).json({
          message: "You're now Friends",
          data: { makeFri, makeAuth },
        });
      }
    } else {
      return res.status(status.NOT_FOUND).json({
        message: "Invalid Id's",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Error Making Friend:${error.message}`,
      info: error,
    });
  }
};

export const unFriend = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { authID, friendID } = req.params;

    const user: any = await authModel.findById(authID);
    const friend: any = await authModel.findById(friendID);

    if (user && friend) {
      let userPush = await user.friend.filter((el: any) => el !== friendID);
      let friendPush = await friend.friend.filter((el: any) => el !== authID);
      const makeFri = await authModel.findByIdAndUpdate(
        authID,
        { friend: userPush },
        { new: true }
      );
      const makeAuth = await authModel.findByIdAndUpdate(
        authID,
        { friend: friendPush },
        { new: true }
      );

      const URL: string = "amqp://localhost:5672";
      const connect = await amqplib.connect(URL);
      const channel = await connect.createChannel();
      const queueName = "messages";
      await channel.assertQueue(queueName);

      await channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify({ makeFri, makeAuth }))
      );

      return res.status(status.OK).json({
        message: "No Longer Friends",
        data: { makeFri, makeAuth },
      });
    } else {
      return res.status(status.FORBIDDEN).json({
        message: "Error",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD_REQUEST).json({
      message: `Friend Request Error:${error.message}`,
      info: error,
    });
  }
};
