"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatModel = new mongoose_1.Schema({
    member: {
        type: (Array),
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("chats", chatModel);
