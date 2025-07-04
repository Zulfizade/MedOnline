import mongoose from 'mongoose';

const patientSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  role: { type: String, default: 'patient' },
  profilePhoto: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String, default: "" },
  pendingEmail: { type: String, default: "" },
  plan: { type: String, enum: ['free', 'pro', 'vip'], default: 'free' },
  planExpires: { type: Date },
  doctorLimit: { type: Number, default: 10 },
  mailLimit: { type: Number, default: 5 }
}, { timestamps: true });

const PatientModel = mongoose.model('Patient', patientSchema);

export default PatientModel;
