import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

export const getTotalCounts = async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    const patientCount = await Patient.countDocuments();
    res.json({ doctorCount, patientCount });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getDailyRegistrations = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = start ? new Date(start) : new Date(Date.now() - 7*24*60*60*1000);
    const endDate = end ? new Date(end) : new Date();
    const doctor = await Doctor.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const patient = await Patient.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ doctor, patient });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getMonthlyRegistrations = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const doctor = await Doctor.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const patient = await Patient.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ doctor, patient });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getGenderStats = async (req, res) => {
  try {
    const { start, end } = req.query;
    let doctorMatch = {};
    let patientMatch = {};
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      doctorMatch = { createdAt: { $gte: startDate, $lte: endDate } };
      patientMatch = { createdAt: { $gte: startDate, $lte: endDate } };
    }
    const doctor = await Doctor.aggregate([
      { $match: doctorMatch },
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);
    const patient = await Patient.aggregate([
      { $match: patientMatch },
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);
    res.json({ doctor, patient });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
