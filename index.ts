import express, { Response, Request, Application } from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import { mainApp } from "./mainApp";
import { Datas } from "./utils/dbConfig";
import notifyModel from "./model/notifyModel";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import amqplib from "amqplib";

const port: number = 3322;
const app: Application = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mainApp(app);

server.listen(port, () => {
  console.log();
  Datas();
});

io.on(
  "connection",
  async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    console.log(socket.id);
    // const URL: string =
    //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";
    const url: string = "amqp://localhost:5672";
    let newData: any = [];

    const connect = await amqplib.connect(url);
    const channel = await connect.createChannel();
    const queueName = "messages";
    await channel.assertQueue(queueName);

    await channel.consume(queueName, async (res: any) => {
      console.log(res);
      newData.push(await JSON.parse(res?.content?.toString()));

      await notifyModel.create({
        notice: {
          data: await JSON.parse(res?.content?.toString()),
          // message: "coming from chat",
        },
      });
      console.log(newData);

      // socket.emit("set07i", await newData);

      await channel.ack(res);
    });
    await channel.assertQueue("send");

    await channel.consume("send", async (res: any) => {
      newData.push(await JSON.parse(res?.content?.toString()));
      console.log("index", res);
      console.log(newData);
      // socket.emit("set07i", await newData);

      await channel.ack(res);
    });
  }
);
