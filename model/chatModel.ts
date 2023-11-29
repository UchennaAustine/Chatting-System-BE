import mongoose, { Schema, model, Document } from "mongoose";

interface iChat {
  member?: Array<string>;
}

interface iChatdata extends iChat, Document {}

const chatModel = new Schema(
  {
    member: {
      type: Array<String>,
    },
  },
  {
    timestamps: true,
  }
);

export default model<iChatdata>("chats", chatModel);
