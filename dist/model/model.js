"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const authModel = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
    },
    friend: {
        type: (Array),
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("auths", authModel);
