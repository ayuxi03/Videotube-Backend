import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription, getUserSubscriptions, getChannelSubscribers } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/c/:channelId").post(toggleSubscription)
router.route("/me/subscribers").get(getChannelSubscribers);

router.route("/subscribed-channels").get(getUserSubscriptions);

export default router;