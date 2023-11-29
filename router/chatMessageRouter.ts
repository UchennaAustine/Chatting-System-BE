import { Router } from "express";
import {
  createChat,
  findChat,
  findOneChat,
} from "../controller/chatController";
import {
  createChatMessage,
  findChatMessage,
} from "../controller/chatMessageController";

const router: Router = Router();

router.route("/:authID/:chatID/chat-message").post(createChatMessage);
router.route("/:chatID/read-chat-message").get(findChatMessage);

export default router;
