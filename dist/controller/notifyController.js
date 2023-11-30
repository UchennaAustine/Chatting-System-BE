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
exports.createNotification = void 0;
const status_1 = require("../utils/status");
const notifyModel_1 = __importDefault(require("../model/notifyModel"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notification } = req.body;
        if (notification !== "") {
            const info = yield notifyModel_1.default.create({
                notification,
            });
            return res.status(status_1.status.CREATED).json({
                message: `Notication`,
                data: info,
            });
        }
        else {
            const url = "amqp://127.0.0.1.27107:5672";
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
