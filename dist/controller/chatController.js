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
exports.findOneChat = exports.deleteChat = exports.findAllChat = exports.findChat = exports.createChat = void 0;
const status_1 = require("../utils/status");
const chatModel_1 = __importDefault(require("../model/chatModel"));
const model_1 = __importDefault(require("../model/model"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID, friendID } = req.params;
        const user = yield model_1.default.findById(authID);
        const friend = yield model_1.default.findById(friendID);
        const findUserFriend = user === null || user === void 0 ? void 0 : user.friend.some((el) => el === friendID);
        const findFriendFriend = friend === null || friend === void 0 ? void 0 : friend.friend.some((el) => el === authID);
        const existingChat = yield chatModel_1.default.findOne({
            member: { $all: [authID, friendID] },
        });
        if (!existingChat) {
            if (findFriendFriend && findUserFriend) {
                const chat = yield chatModel_1.default.create({
                    member: [authID, friendID],
                });
                return res.status(status_1.status.CREATED).json({
                    message: "Chat created successfully",
                    data: chat,
                });
            }
            else {
                return res.status(status_1.status.FORBIDDEN).json({
                    message: "You are not friends",
                });
            }
        }
        else {
            return res.status(status_1.status.FORBIDDEN).json({
                message: "Chat already exists",
            });
        }
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Chat Creation error:${error.message}`,
            info: error,
        });
    }
});
exports.createChat = createChat;
const findChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID } = req.params;
        const chat = yield chatModel_1.default.find({
            member: {
                $in: [authID],
            },
        });
        return res.status(status_1.status.OK).json({
            message: `Chat has being found`,
            data: chat,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Find Chat error:${error.message}`,
            info: error,
        });
    }
});
exports.findChat = findChat;
const findAllChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatModel_1.default.find();
        return res.status(status_1.status.OK).json({
            message: `All Chats`,
            data: chat,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Find Chat error:${error.message}`,
            info: error,
        });
    }
});
exports.findAllChat = findAllChat;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID } = req.params;
        const chat = yield chatModel_1.default.findByIdAndDelete(chatID);
        return res.status(status_1.status.OK).json({
            message: `Chat has being delete`,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `delete Chat error:${error.message}`,
            info: error,
        });
    }
});
exports.deleteChat = deleteChat;
const findOneChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID, friendID } = req.params;
        const chat = yield chatModel_1.default.findOne({
            member: {
                $all: [authID, friendID],
            },
        });
        return res.status(status_1.status.OK).json({
            message: `Chat Creation`,
            data: chat,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Getting Single Chat Error:${error.message}`,
            info: error,
        });
    }
});
exports.findOneChat = findOneChat;
