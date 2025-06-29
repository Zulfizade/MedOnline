// backend/controller/profileController.js
import fs from "fs";
import path from "path";
import { sendVerificationCode } from "../utils/emailSender.js";
export const uploadProfilePhoto = async (req, res) => {
  const user = req.userDoc;
  if (!req.file) return res.status(400).json({ message: "Şəkil tapılmadı" });

  // Köhnə şəkli sil
  if (user.profilePhoto) {
    const oldPath = path.join("uploads/profile_photos", user.profilePhoto);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  user.profilePhoto = req.file.filename;
  await user.save();
  res.json({ profilePhoto: `profile_photos/${user.profilePhoto}` });
};

// Profil şəklini sil
export const deleteProfilePhoto = async (req, res) => {
  const user = req.userDoc;
  if (user.profilePhoto) {
    const oldPath = path.join("uploads/profile_photos", user.profilePhoto);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    user.profilePhoto = "";
    await user.save();
  }
  res.json({ message: "Profil şəkli silindi" });
};


// Sertifikat əlavə et (doctor üçün)
export const uploadCertificate = async (req, res) => {
  const user = req.userDoc;
  if (!req.file) return res.status(400).json({ message: "Sertifikat tapılmadı" });
  user.certificates.push(`certificates/${req.file.filename}`);
  await user.save();
  res.json({ certificates: user.certificates });
};

// Sertifikat sil (doctor üçün, ən azı 1 qalmalıdır)
export const deleteCertificate = async (req, res) => {
  const user = req.userDoc;
  const { filename } = req.body;
  // İlk sertifikat silinməz
  if (user.certificates[0] === filename) {
    return res.status(400).json({ message: "Qeydiyyat zamanı əlavə olunan sertifikat silinə bilməz!" });
  }
  user.certificates = user.certificates.filter(f => f !== filename);
  const certPath = path.join("uploads", filename);
  if (fs.existsSync(certPath)) fs.unlinkSync(certPath);
  await user.save();
  res.json({ certificates: user.certificates });
};

// Ad dəyiş
export const updateName = async (req, res) => {
  req.userDoc.name = req.body.name;
  await req.userDoc.save();
  res.json({ name: req.userDoc.name });
};

// Email dəyişmək üçün kod göndər
export const requestEmailChange = async (req, res) => {
  const { newEmail } = req.body;
  req.userDoc.pendingEmail = newEmail;
  req.userDoc.emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  req.userDoc.emailVerified = false;
  await req.userDoc.save();
  await sendVerificationCode(newEmail, req.userDoc.emailVerificationCode);
  res.json({ message: "Kod göndərildi" });
};

// Email təsdiqlə və dəyiş
export const verifyEmailChange = async (req, res) => {
  const { code } = req.body;
  if (req.userDoc.emailVerificationCode === code && req.userDoc.pendingEmail) {
    req.userDoc.email = req.userDoc.pendingEmail;
    req.userDoc.pendingEmail = "";
    req.userDoc.emailVerified = true;
    req.userDoc.emailVerificationCode = "";
    await req.userDoc.save();
    res.json({ message: "Email uğurla dəyişdirildi" });
  } else {
    res.status(400).json({ message: "Kod səhvdir və ya dəyişiklik yoxdur" });
  }
};