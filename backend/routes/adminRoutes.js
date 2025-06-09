import express from "express";
import {
  approveDoctor,
  getPendingDoctors,
  getAllPatients,
} from "../controller/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin yetkili işlemler
router.patch("/approve-doctor/:id", protect, requireAdmin, approveDoctor);
router.get("/pending-doctors", protect, requireAdmin, getPendingDoctors);
router.get("/patients", protect, requireAdmin, getAllPatients);

export default router;
