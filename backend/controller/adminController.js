import DoctorModel from "../models/doctorModel.js";
import PatientModel from "../models/patientModel.js";

// Doktoru onayla
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doktor bulunamadı" });

    doctor.isVerified = true;
    await doctor.save();

    res.json({ message: "Doktor onaylandı" });
  } catch (error) {
    console.error("Doktor onaylama hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Onay bekleyen doktorları getir
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ isVerified: false });
    res.json(doctors);
  } catch (error) {
    console.error("Onay bekleyen doktorları getirirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Tüm hastaları getir
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find({});
    res.json(patients);
  } catch (error) {
    console.error("Hastaları getirirken hata:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
