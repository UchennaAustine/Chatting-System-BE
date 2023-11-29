import { Router } from "express";
import {
  createAuth,
  makeFriend,
  deleteAuth,
  findAuth,
  findOneAuth,
  unFriend,
} from "../controller/controller";

const router: Router = Router();

router.route("/create-auth").post(createAuth);
router.route("/find-auth").get(findAuth);
router.route("/:authID/find-one-auth").get(findOneAuth);
router.route("/:authID/delete-auth").delete(deleteAuth);
router.route("/:authID/:friendID/make-friend").patch(makeFriend);
router.route("/:authID/:friendID/un-friend").patch(unFriend);

export default router;
