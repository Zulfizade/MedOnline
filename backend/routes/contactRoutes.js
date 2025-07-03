import express from "express";
import { sendContactMessage, getAllContactMessages, replyToContactMessage } from "../controller/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendContactMessage);
router.get("/", protect, getAllContactMessages);
router.post("/reply/:id", protect, replyToContactMessage);

export default router;
