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
exports.deleteAllNotifications = exports.deleteOneNotification = exports.readNotification = exports.createNotification = void 0;
const status_1 = require("../utils/status");
const notifyModel_1 = __importDefault(require("../model/notifyModel"));
const amqplib_1 = __importDefault(require("amqplib"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notification } = req.body;
        if (notification !== "") {
            const info = yield notifyModel_1.default.create({
                notification,
            });
            // const url =
            //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";
            const amqpServer = "amqp://localhost:5672";
            const connect = yield amqplib_1.default.connect(amqpServer);
            const channel = yield connect.createChannel();
            yield channel.sendToQueue("send", Buffer.from(JSON.stringify(info)));
            return res.status(status_1.status.CREATED).json({
                message: `Notication`,
                data: info,
            });
        }
        else {
            // const url =
            //   "amqps://mqclkzbe:92HIEuK2frGjEP8O8FS_rpJG2lTicnGa@octopus.rmq3.cloudamqp.com/mqclkzbe";
            const amqpServer = "amqp://localhost:5672";
            let newData = [];
            const connect = yield amqplib_1.default.connect(amqpServer);
            const channel = yield connect.createChannel();
            const queueName = "messages";
            yield channel.assertQueue(queueName).then((res) => {
                console.log("connected", res);
            });
            yield channel.consume(queueName, (res) => __awaiter(void 0, void 0, void 0, function* () {
                newData.push(yield JSON.parse(res === null || res === void 0 ? void 0 : res.content.toString()));
                yield channel.sendToQueue("send", Buffer.from(JSON.stringify(res)));
                yield notifyModel_1.default.create({
                    notification: res,
                });
                yield channel.ack(res);
            }));
            return res.status(status_1.status.CREATED).json({
                message: "New Notification",
            });
        }
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Notification Creation error:${error.message}`,
            info: error,
        });
    }
});
exports.createNotification = createNotification;
const readNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notifyModel_1.default.find();
        return res.status(status_1.status.OK).json({
            message: `Messages: ${notifications === null || notifications === void 0 ? void 0 : notifications.length}`,
            data: notifications,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: "Error Reading Notifications",
        });
    }
});
exports.readNotification = readNotification;
const deleteOneNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notifyID } = req.params;
        yield notifyModel_1.default.findByIdAndDelete(notifyID);
        return res.status(status_1.status.OK).json({
            message: `Notification has being deleted:`,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: "Error",
        });
    }
});
exports.deleteOneNotification = deleteOneNotification;
const deleteAllNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete all notifications
        yield notifyModel_1.default.deleteMany();
        return res.status(status_1.status.OK).json({
            message: "Notifications have been deleted",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(status_1.status.BAD_REQUEST).json({
            message: "Error deleting notifications",
        });
    }
});
exports.deleteAllNotifications = deleteAllNotifications;
