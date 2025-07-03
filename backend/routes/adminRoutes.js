import express from "express";
import {
  approveDoctor,
  getPendingDoctors,
  getApprovedDoctors,
  getAllPatients,
  deleteDoctor,
  rejectDoctor,
  deletePatient,
} from "../controller/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


// Bütün doctorlar (admin panel üçün)
router.get("/doctors", protect, requireAdmin, async (req, res) => {
  try {
    const doctors = await (await import("../models/doctorModel.js")).default.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
});
router.get("/pending-doctors", protect, requireAdmin, getPendingDoctors);
router.get("/patients", protect, requireAdmin, getAllPatients);
router.get("/approved-doctors", getApprovedDoctors);

router.patch("/approve-doctor/:id", protect, requireAdmin, approveDoctor);
router.patch("/reject-doctor/:id", protect, requireAdmin, rejectDoctor);
router.delete("/delete-doctor/:id", protect, requireAdmin, deleteDoctor);
router.delete("/delete-patient/:id", protect, requireAdmin, deletePatient);

export default router;
