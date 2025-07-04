import PatientModel from '../models/patientModel.js';

const PLAN_CONFIG = {
  pro:   { price: 15, doctorLimit: 100, mailLimit: 20, duration: 30 },
  vip:   { price: 30, doctorLimit: 200, mailLimit: 50, duration: 30 }
};

export const fakePayment = async (req, res) => {
  const { plan } = req.body;
  const userId = req.user._id;
  if (!PLAN_CONFIG[plan]) return res.status(400).json({ error: 'Invalid plan' });
  const config = PLAN_CONFIG[plan];
  await PatientModel.findByIdAndUpdate(userId, {
    plan,
    planExpires: new Date(Date.now() + config.duration * 24 * 60 * 60 * 1000),
    doctorLimit: config.doctorLimit,
    mailLimit: config.mailLimit
  });
  res.json({ success: true, message: 'Plan uğurla dəyişdirildi!' });
};
