"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const chatRouter_1 = __importDefault(require("./router/chatRouter"));
const chatMessageRouter_1 = __importDefault(require("./router/chatMessageRouter"));
const mainApp = (app) => {
    try {
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use("/api", authRouter_1.default);
        app.use("/api", chatMessageRouter_1.default);
        app.use("/api", chatRouter_1.default);
        app.get("/", (req, res) => {
            return res.status(200).json({
                message: "App is active",
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.mainApp = mainApp;
