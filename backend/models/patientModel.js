import mongoose from 'mongoose';

const patientSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: { type: String, default: 'patient' },
}, { timestamps: true });

const PatientModel = mongoose.model('Patient', patientSchema);

export default PatientModel;
