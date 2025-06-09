import jwt from "jsonwebtoken";
import DoctorModel from "../models/doctorModel.js";
import PatientModel from "../models/patientModel.js";
import AdminModel from "../models/adminModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    

    if (!token) {
      return res.status(401).json({ message: "Yetkisiz erişim. Token yok." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    let user;
    if (decoded.role === "doctor") {
      user = await DoctorModel.findById(decoded.id);
    } else if (decoded.role === "patient") {
      user = await PatientModel.findById(decoded.id);
    } else if (decoded.role === "admin") {
      user = await AdminModel.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    req.user = {
      id: user._id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("authMiddleware hata:", error.message);
    return res
      .status(401)
      .json({ message: "Geçersiz veya süresi dolmuş token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin yetkisi gerekli" });
  }
  next();
};
