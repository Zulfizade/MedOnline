import jwt from "jsonwebtoken";
import DoctorModel from "../models/doctorModel.js";
import PatientModel from "../models/patientModel.js";
import AdminModel from "../models/adminModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ message: "Yetkisiz erişim. Token yok." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let userDoc;
    if (decoded.role === "doctor") {
      userDoc = await DoctorModel.findById(decoded.id);
    } else if (decoded.role === "patient") {
      userDoc = await PatientModel.findById(decoded.id);
    } else if (decoded.role === "admin") {
      userDoc = await AdminModel.findById(decoded.id);
    }
    if (!userDoc)
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });

    req.user = { id: userDoc._id, role: decoded.role };
    req.userDoc = userDoc; // Əlavə et!
    next();
  } catch (error) {
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
