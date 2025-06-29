import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import DoctorModel from "../models/doctorModel.js";
import PatientModel from "../models/patientModel.js";
import AdminModel from "../models/adminModel.js"; // Admin modeli eklendi

const JWT_SECRET = process.env.JWT_SECRET;

// Token oluşturma yardımcı fonksiyonu
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Admin Kayıt
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Şifreler uyuşmuyor" });
    }

    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı (admin)" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    const token = createToken(admin);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Admin başarıyla oluşturuldu",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      });
  } catch (error) {
    console.error("Admin kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Doctor Kayıt
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, university, specialty, description } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Şifreler uyuşmuyor" });
    }

    const existingDoctor = await DoctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const certificate = req.file?.path;

    if (!certificate) {
      return res.status(400).json({ message: "Sertifikat yüklənməlidir!" });
    }

    const doctor = new DoctorModel({
      name,
      email,
      password: hashedPassword,
      university,
      certificates: [certificate],
      specialty,
      description, // <-- ƏLAVƏ OLUNDU
      isVerified: false,
      role: "doctor",
    });

    await doctor.save();

    // Qeydiyyatdan sonra cookie YAZMA!
    // const token = createToken(doctor);
    // res.cookie(...)

    res.status(201).json({
      message: "Doktor kaydedildi, admin onayı bekleniyor",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
        isVerified: doctor.isVerified,
      },
    });
  } catch (error) {
    console.error("Doktor kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Patient Kayıt
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Şifreler uyuşmuyor" });
    }

    const existingPatient = await PatientModel.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const patient = new PatientModel({
      name,
      email,
      password: hashedPassword,
      role: "patient",
    });

    await patient.save();

    // Qeydiyyatdan sonra cookie YAZMA!
    // const token = createToken(patient);
    // res.cookie(...)

    res.status(201).json({
      message: "Hasta kaydedildi",
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Hasta kayıt hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Login (Doctor, Patient, Admin)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await DoctorModel.findOne({ email });
    let role = "doctor";

    if (user) {
      // Pending doctor üçün girişə icazə vermə!
      if (!user.isVerified) {
        return res.status(403).json({ message: "Hesabınız admin tərəfindən təsdiqlənməyib. Qısa müddətdə baxılacaq." });
      }
    } else {
      user = await PatientModel.findOne({ email });
      role = "patient";
      if (!user) {
        user = await AdminModel.findOne({ email });
        role = "admin";
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    const token = createToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Giriş başarılı",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified || undefined,
        },
      });
  } catch (error) {
    console.error("Login hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Oturum sonlandırıldı" });
};

export const getMe = async (req, res) => {
  try {
    // req.user protect middleware-dən gəlir
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
