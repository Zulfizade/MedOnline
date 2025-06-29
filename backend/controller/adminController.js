import DoctorModel from "../models/doctorModel.js";
import PatientModel from "../models/patientModel.js";

// Pending doctorları gətir
export const getPendingDoctors = async (req, res) => {
  try {
    // Yalnız pending, rejected olmayan doctorlar
    const doctors = await DoctorModel.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Təsdiqlənmiş doctorları gətir
export const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({ isVerified: true });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Bütün patientləri gətir
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Doktoru təsdiqlə
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doktor tapılmadı" });
    doctor.isVerified = true;
    doctor.rejected = false;
    await doctor.save();
    res.json({ message: "Doktor təsdiqləndi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Doktoru ləğv et (təsdiqləmədən imtina)
export const rejectDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doktor tapılmadı" });
    doctor.isVerified = false;
    doctor.rejected = true;
    await doctor.save();
    res.json({ message: "Doktor təsdiqlənmədi (ləğv olundu)" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Doktoru sil
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doktor tapılmadı" });
    res.json({ message: "Doktor silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Patient sil
export const deletePatient = async (req, res) => {
  try {
    const patient = await PatientModel.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient tapılmadı" });
    res.json({ message: "Patient silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
