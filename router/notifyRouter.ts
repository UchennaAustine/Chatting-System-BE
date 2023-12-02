import { Router } from "express";
import {
  createNotification,
  deleteAllNotifications,
  deleteOneNotification,
  readNotification,
} from "../controller/notifyController";

const router: Router = Router();

router.route("/notify").post(createNotification);
router.route("/read-notify").get(readNotification);
router.route("/:notifyID/delete-notify").delete(deleteOneNotification);
router.route("/empty-notify").delete(deleteAllNotifications);

export default router;
