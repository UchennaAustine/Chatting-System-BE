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
exports.findChatMessage = exports.createChatMessage = void 0;
const status_1 = require("../utils/status");
const chatMessageModel_1 = __importDefault(require("../model/chatMessageModel"));
const amqplib_1 = __importDefault(require("amqplib"));
const createChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID, chatID } = req.params;
        const { message } = req.body;
        const chatMessage = yield chatMessageModel_1.default.create({
            authID,
            chatID,
            message,
        });
        const URL = "amqp://localhost:5672";
        const connect = yield amqplib_1.default.connect(URL);
        const channel = yield connect.createChannel();
        yield channel.sendToQueue("sendChat", Buffer.from(JSON.stringify(chatMessage)));
        return res.status(status_1.status.CREATED).json({
            message: `Chat Message Creation`,
            data: chatMessage,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Chat Creation error:${error.message}`,
            info: error,
        });
    }
});
exports.createChatMessage = createChatMessage;
const findChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID } = req.params;
        const chatMessage = yield chatMessageModel_1.default.find({ chatID });
        return res.status(status_1.status.OK).json({
            message: `read Message `,
            data: chatMessage,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Chat Creation error:${error.message}`,
            info: error,
        });
    }
});
exports.findChatMessage = findChatMessage;
