import express from 'express';
import {
  registerDoctor,
  registerPatient,
  login,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

//  Kayıt Rotaları
router.post('/register/doctor', registerDoctor);
router.post('/register/patient', registerPatient);

//  Giriş ve Çıkış
router.post('/login', login);
router.post('/logout', logout);

export default router;
