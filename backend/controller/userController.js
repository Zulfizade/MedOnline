import PatientModel from '../models/patientModel.js';

export const getLimits = async (req, res) => {
  const user = await PatientModel.findById(req.user._id);
  res.json({
    plan: user.plan,
    planExpires: user.planExpires,
    doctorLimit: user.doctorLimit,
    mailLimit: user.mailLimit
  });
};

export const useLimit = async (req, res) => {
  const { type } = req.body; // 'doctor' or 'mail'
  const user = await PatientModel.findById(req.user._id);
  if (type === 'doctor' && user.doctorLimit > 0) {
    user.doctorLimit -= 1;
    await user.save();
    return res.json({ success: true, left: user.doctorLimit });
  }
  if (type === 'mail' && user.mailLimit > 0) {
    user.mailLimit -= 1;
    await user.save();
    return res.json({ success: true, left: user.mailLimit });
  }
  res.status(403).json({ success: false, message: 'Limit bitib' });
};
