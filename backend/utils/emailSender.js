import nodemailer from 'nodemailer';
import PatientModel from '../models/patientModel.js';
import DoctorModel from '../models/doctorModel.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
export const sendVerificationCode = async (email, code) => {
  try {
    console.log("📨 Doğrulama kodu gönderme işlemi başlatıldı. Email:", email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Doğrulama Kodu',
      text: `Doğrulama kodunuz: ${code}`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📬 Doğrulama kodu gönderildi. Sonuç:", result);
  } catch (error) {
    console.error('❌ Doğrulama kodu gönderme hatası:', error.message);
  }
};
