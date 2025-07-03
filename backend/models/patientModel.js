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
  pendingEmail: { type: String, default: "" }
}, { timestamps: true });

const PatientModel = mongoose.model('Patient', patientSchema);

export default PatientModel;
