import express from "express";
import { getTotalCounts, getDailyRegistrations, getMonthlyRegistrations, getGenderStats } from "../controller/statisticController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/total", protect, getTotalCounts);
router.get("/daily", protect, getDailyRegistrations);
router.get("/monthly", protect, getMonthlyRegistrations);
router.get("/gender", protect, getGenderStats);

export default router;
