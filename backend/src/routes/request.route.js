import express from "express";
import { sendRequest, getRequests, acceptRequest, rejectRequest, cancelRequest, removeLynk, sentRequests, getLynks } from "../controllers/request.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send", protectRoute, sendRequest);
router.get("/incoming", protectRoute, getRequests);
router.get("/outgoing", protectRoute, sentRequests);
router.get("/my-lynks", protectRoute, getLynks);
router.put("/accept", protectRoute, acceptRequest);
router.put("/reject", protectRoute, rejectRequest);
router.put("/cancel", protectRoute, cancelRequest);
router.put("/remove-lynk", protectRoute, removeLynk);

export default router;
