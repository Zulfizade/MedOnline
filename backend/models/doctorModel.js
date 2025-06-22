import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String, required: true },
  certificate: { type: String, required: true },
  specialty: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false }, // Əlavə olundu
  role: { type: String, default: 'doctor' },
}, { timestamps: true });

const DoctorModel = mongoose.model('Doctor', doctorSchema);

export default DoctorModel;
