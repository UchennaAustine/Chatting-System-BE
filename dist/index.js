"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const mainApp_1 = require("./mainApp");
const dbConfig_1 = require("./utils/dbConfig");
const notifyModel_1 = __importDefault(require("./model/notifyModel"));
const amqplib_1 = __importDefault(require("amqplib"));
const port = 3322;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
(0, mainApp_1.mainApp)(app);
server.listen(port, () => {
    console.log();
    (0, dbConfig_1.Datas)();
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(socket.id);
    // const URL: string =
    //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";
    const url = "amqp://localhost:5672";
    let newData = [];
    const connect = yield amqplib_1.default.connect(url);
    const channel = yield connect.createChannel();
    const queueName = "messages";
    yield channel.assertQueue(queueName);
    yield channel.consume(queueName, (res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        console.log(res);
        newData.push(yield JSON.parse((_a = res === null || res === void 0 ? void 0 : res.content) === null || _a === void 0 ? void 0 : _a.toString()));
        yield notifyModel_1.default.create({
            notice: {
                data: yield JSON.parse((_b = res === null || res === void 0 ? void 0 : res.content) === null || _b === void 0 ? void 0 : _b.toString()),
                // message: "coming from chat",
            },
        });
        console.log(newData);
        // socket.emit("set07i", await newData);
        yield channel.ack(res);
    }));
    yield channel.assertQueue("send");
    yield channel.consume("send", (res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        newData.push(yield JSON.parse((_c = res === null || res === void 0 ? void 0 : res.content) === null || _c === void 0 ? void 0 : _c.toString()));
        console.log("index", res);
        console.log(newData);
        // socket.emit("set07i", await newData);
        yield channel.ack(res);
    }));
}));
