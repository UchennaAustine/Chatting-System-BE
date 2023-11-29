import mongoose, { Schema, model, Document } from "mongoose";

interface iChatMessage {
  chatID?: string;
  authID?: string;
  message?: string;
}

interface iChatMessageData extends iChatMessage, Document {}

const chatMessageModel = new Schema(
  {
    chatID: {
      type: String,
    },
    authID: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model<iChatMessageData>("chatMessages", chatMessageModel);
