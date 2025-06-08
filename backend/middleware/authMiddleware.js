import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';
import Patient from '../models/patientModel.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz erişim. Token yok.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id);
    } else if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    req.user = {
      id: user._id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('authMiddleware hata:', error.message);
    return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};
