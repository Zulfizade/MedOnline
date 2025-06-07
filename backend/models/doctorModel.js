import mongoose from 'mongoose';

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirm_password: { type: String, required: true },
  university: { type: String, required: true },
  certificate: { type: String, required: true }, // Sertifika dosyasının yolu, örn: /uploads/cert-12345.pdf
  isVerified: { type: Boolean, default: false }, // Admin onayı için
  role: { type: String, default: 'doctor' },
}, { timestamps: true });

const DoctorModel = mongoose.model('Doctor', doctorSchema);

export default DoctorModel;
