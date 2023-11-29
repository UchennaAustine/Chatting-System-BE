"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatMessageController_1 = require("../controller/chatMessageController");
const router = (0, express_1.Router)();
router.route("/:authID/:chatID/chat-message").post(chatMessageController_1.createChatMessage);
router.route("/:chatID/read-chat-message").get(chatMessageController_1.findChatMessage);
exports.default = router;
