// backend/routes/profileRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCertificate } from "../middleware/uploadCertificate.js";
import { uploadProfilePhoto } from "../middleware/uploadProfilePhoto.js";
import {
  uploadCertificate as uploadCertificateController,
  deleteCertificate,
  uploadProfilePhoto as uploadProfilePhotoController,
  deleteProfilePhoto,
} from "../controller/profileController.js";

const router = express.Router();

router.post(
  "/profile-photo",
  protect,
  uploadProfilePhoto.single("photo"), // DİQQƏT: "photo" olmalıdır!
  uploadProfilePhotoController
);
router.delete("/profile-photo", protect, deleteProfilePhoto);
router.post("/certificate", protect, uploadCertificate.single("certificate"), uploadCertificateController);
router.delete("/certificate", protect, deleteCertificate);

export default router;