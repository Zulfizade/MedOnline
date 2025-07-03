import express from "express";
import { createTip, getAllTips, updateTip, deleteTip } from "../controller/tipController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadTipPhoto } from "../middleware/uploadTipPhoto.js";

const router = express.Router();

router.post("/", protect, uploadTipPhoto.single("image"), createTip);
router.get("/", getAllTips);
router.patch("/:id", protect, uploadTipPhoto.single("image"), updateTip);
router.delete("/:id", protect, deleteTip);

export default router;
