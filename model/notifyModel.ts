import { Schema, model, Document } from "mongoose";

interface iNotify {
  notification: {};
}

interface iNotifyData extends iNotify, Document {}

const notifyModel = new Schema(
  {
    notification: {
      type: {},
    },
  },
  { timestamps: true }
);

export default model<iNotifyData>("notifications", notifyModel);
