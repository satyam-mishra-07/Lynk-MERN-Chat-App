import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLynkedUser, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getLynkedUser);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;