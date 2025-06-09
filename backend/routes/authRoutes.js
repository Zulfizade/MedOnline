import express from 'express';
import {
  registerDoctor,
  registerPatient,
  registerAdmin,
  login,
  logout,
} from '../controller/authController.js';
import {
  approveDoctor,
  getPendingDoctors,
  getAllPatients,
} from '../controller/adminController.js';
import { uploadCertificate } from '../middleware/uploadCertificate.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Auth işlemleri
router.post('/register/doctor', uploadCertificate.single('certificate'), registerDoctor);
router.post('/register/patient', registerPatient);
router.post('/register/admin', registerAdmin); // Admin kaydı
router.post('/login', login);
router.post('/logout', logout);


export default router;
