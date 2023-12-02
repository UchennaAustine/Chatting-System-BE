"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const chatRouter_1 = __importDefault(require("./router/chatRouter"));
const chatMessageRouter_1 = __importDefault(require("./router/chatMessageRouter"));
const notifyRouter_1 = __importDefault(require("./router/notifyRouter"));
const status_1 = require("./utils/status");
const mainApp = (app) => {
    try {
        app.use((0, cors_1.default)());
        app.use((0, morgan_1.default)("dev"));
        app.use(express_1.default.json());
        app.use("/api", authRouter_1.default);
        app.use("/api", chatMessageRouter_1.default);
        app.use("/api", chatRouter_1.default);
        app.use("/api", notifyRouter_1.default);
        app.get("/", (req, res) => {
            try {
                return res.status(status_1.status.OK).json({
                    message: "App API is active",
                });
            }
            catch (error) {
                return res.status(status_1.status.BAD_REQUEST).json({
                    message: `App API Error: ${error.message}`,
                    source: error,
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.mainApp = mainApp;
