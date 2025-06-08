import express from 'express';
import {
  registerDoctor,
  registerPatient,
  login,
  logout,
} from '../controller/authController.js';
import { uploadCertificate } from '../middleware/uploadCertificate.js';

const router = express.Router();

// Multer middleware'i sadece doktor kayıtta çalışır
router.post('/register/doctor', uploadCertificate.single('certificate'), registerDoctor);
router.post('/register/patient', registerPatient);
router.post('/login', login);
router.post('/logout', logout);

export default router;
