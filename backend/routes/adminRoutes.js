import express from "express";
import {
  approveDoctor,
  getPendingDoctors,
  getAllPatients,
  deleteDoctor,
  rejectDoctor,
  deletePatient,
} from "../controller/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/pending-doctors", protect, requireAdmin, getPendingDoctors);
router.get("/patients", protect, requireAdmin, getAllPatients);

router.patch("/approve-doctor/:id", protect, requireAdmin, approveDoctor);
router.patch("/reject-doctor/:id", protect, requireAdmin, rejectDoctor);
router.delete("/delete-doctor/:id", protect, requireAdmin, deleteDoctor);
router.delete("/delete-patient/:id", protect, requireAdmin, deletePatient);

export default router;
