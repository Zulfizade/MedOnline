import express from 'express';
import DoctorModel from '../models/doctorModel.js';

const router = express.Router();


// GET /api/doctors?speciality=Kardioloq
router.get('/', async (req, res) => {
  try {
    const { speciality, name } = req.query;
    let filter = { isVerified: true };
    if (speciality) {
      filter.specialty = { $regex: new RegExp(speciality, 'i') };
    }
    if (name) {
      filter.name = { $regex: new RegExp(name, 'i') };
    }
    const doctors = await DoctorModel.find(filter);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
