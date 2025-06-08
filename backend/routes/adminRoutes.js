// routes/adminRoutes.js
import express from 'express';
import Doctor from '../models/doctorModel.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Doktoru onayla
router.patch('/approve-doctor/:id', adminAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doktor bulunamadı' });

    doctor.isApproved = true;
    await doctor.save();

    res.json({ message: 'Doktor onaylandı' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Onay bekleyen doktorları listele
router.get('/pending-doctors', adminAuth, async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

export default router;
