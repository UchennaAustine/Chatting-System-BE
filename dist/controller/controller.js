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
exports.unFriend = exports.makeFriend = exports.deleteAuth = exports.findOneAuth = exports.findAuth = exports.createAuth = void 0;
const status_1 = require("../utils/status");
const model_1 = __importDefault(require("../model/model"));
const amqplib_1 = __importDefault(require("amqplib"));
const createAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const user = yield model_1.default.create({
            userName,
            email,
            password,
        });
        return res.status(status_1.status.CREATED).json({
            message: `Registration`,
            data: user,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Registration error:${error.message}`,
            info: error,
        });
    }
});
exports.createAuth = createAuth;
const findAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.find().sort({ userName: 1 });
        return res.status(status_1.status.OK).json({
            message: `All Users: ${user.length}`,
            data: user,
        });
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Getting All Users Error:${error.message}`,
            info: error,
        });
    }
});
exports.findAuth = findAuth;
const findOneAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID } = req.params;
        const user = yield model_1.default.findById(authID);
        if (user) {
            return res.status(status_1.status.OK).json({
                message: `User:${user === null || user === void 0 ? void 0 : user.userName}`,
                data: user,
            });
        }
        else {
            return res.status(status_1.status.NOT_FOUND).json({
                message: `Invalid user`,
            });
        }
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Getting Single User error:${error.message}`,
            info: error,
        });
    }
});
exports.findOneAuth = findOneAuth;
const deleteAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID } = req.params;
        const user = yield model_1.default.findByIdAndDelete(authID);
        if (user) {
            return res.status(status_1.status.OK).json({
                message: "Delete",
            });
        }
        else {
            return res.status(status_1.status.FORBIDDEN).json({
                message: `Invalid user`,
            });
        }
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `find one error:${error.message}`,
            info: error,
        });
    }
});
exports.deleteAuth = deleteAuth;
const makeFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID, friendID } = req.params;
        const user = yield model_1.default.findById(authID);
        const friend = yield model_1.default.findById(friendID);
        if (user && friend) {
            if (user.friend.some((el) => el === friendID)) {
                return res.status(status_1.status.FORBIDDEN).json({
                    message: "Already friends",
                });
            }
            else {
                let userPush = [...user.friend, friendID];
                let friendPush = [...friend.friend, authID];
                const makeFri = yield model_1.default.findByIdAndUpdate(authID, { friend: userPush }, { new: true });
                const makeAuth = yield model_1.default.findByIdAndUpdate(friendID, { friend: friendPush }, { new: true });
                const URL = "amqp://localhost:5672";
                const connect = yield amqplib_1.default.connect(URL);
                const channel = yield connect.createChannel();
                yield channel.sendToQueue("info", Buffer.from(JSON.stringify({ makeFri, makeAuth })));
                return res.status(status_1.status.OK).json({
                    message: "You're now Friends",
                    data: { makeFri, makeAuth },
                });
            }
        }
        else {
            return res.status(status_1.status.NOT_FOUND).json({
                message: "Invalid Id's",
            });
        }
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Error Making Friend:${error.message}`,
            info: error,
        });
    }
});
exports.makeFriend = makeFriend;
const unFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authID, friendID } = req.params;
        const user = yield model_1.default.findById(authID);
        const friend = yield model_1.default.findById(friendID);
        if (user && friend) {
            let userPush = yield user.friend.filter((el) => el !== friendID);
            let friendPush = yield friend.friend.filter((el) => el !== authID);
            const makeFri = yield model_1.default.findByIdAndUpdate(authID, { friend: userPush }, { new: true });
            const makeAuth = yield model_1.default.findByIdAndUpdate(authID, { friend: friendPush }, { new: true });
            const URL = "amqp://localhost:5672";
            const connect = yield amqplib_1.default.connect(URL);
            const channel = yield connect.createChannel();
            yield channel.sendToQueue("info", Buffer.from(JSON.stringify({ makeFri, makeAuth })));
            return res.status(status_1.status.OK).json({
                message: "No Longer Friends",
                data: { makeFri, makeAuth },
            });
        }
        else {
            return res.status(status_1.status.FORBIDDEN).json({
                message: "Error",
            });
        }
    }
    catch (error) {
        return res.status(status_1.status.BAD_REQUEST).json({
            message: `Friend Request Error:${error.message}`,
            info: error,
        });
    }
});
exports.unFriend = unFriend;
