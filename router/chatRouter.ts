import { Router } from "express";
import {
  createChat,
  deleteChat,
  findAllChat,
  findChat,
  findOneChat,
} from "../controller/chatController";

const router: Router = Router();

router.route("/:authID/:friendID/chat").post(createChat);
router.route("/:authID/find-chat").get(findChat);
router.route("/chats").get(findAllChat);
router.route("/:chatID/delete-chat").delete(deleteChat);
router.route("/:authID/:friendID/find-one-chat").get(findOneChat);

export default router;
