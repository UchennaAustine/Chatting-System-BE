"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatMessageModel = new mongoose_1.Schema({
    chatID: {
        type: String,
    },
    authID: {
        type: String,
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("chatMessages", chatMessageModel);
