import mongoose from "mongoose";

const url: string = `mongodb://127.0.0.1:27017/SocketDB`;

export const Datas = async () => {
  mongoose.connect(url).then(() => {
    console.log(`db connected`);
  });
};
