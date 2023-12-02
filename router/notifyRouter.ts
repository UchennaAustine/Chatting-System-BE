import { Router } from "express";
import {
  createNotification,
  readNotification,
} from "../controller/notifyController";

const router: Router = Router();

router.route("/notify").post(createNotification);
router.route("/read-notify").get(readNotification);
router.route("/:notifyID/delete-notify").delete(readNotification);

export default router;
