import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String, required: true },
  certificates: [{ type: String }],
  specialty: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  role: { type: String, default: 'doctor' },
  profilePhoto: { type: String, default: "" },
  description: { type: String, default: "" }, // <-- ƏLAVƏ OLUNDU
  emailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String, default: "" },
  pendingEmail: { type: String, default: "" },
}, { timestamps: true });

const DoctorModel = mongoose.model('Doctor', doctorSchema);

export default DoctorModel;
