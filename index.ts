import express, { Response, Request, Application } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { mainApp } from "./mainApp";
import { Datas } from "./utils/dbConfig";

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

io.on("connection", (socket) => {
  console.log(socket);
});
