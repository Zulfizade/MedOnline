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

export const sendOfflineEmailNotification = async (receiverId, message) => {
  try {
    console.log("📨 Mail gönderme işlemi başlatıldı. Receiver ID:", receiverId);

    let user = await PatientModel.findById(receiverId);
    let receiverModel = 'Patient';

    if (!user) {
      user = await DoctorModel.findById(receiverId);
      receiverModel = 'Doctor';
    }

    console.log("🔍 Bulunan kullanıcı:", user);

    if (!user || !user.email) {
      console.warn(`⚠️ Alıcı bulunamadı veya email yok (ID: ${receiverId})`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '💬 Yeni Mesajınız Var',
      text: `Merhaba ${user.name},\n\nSize yeni bir mesaj gönderildi:\n\n"${message}"\n\nMesajınızı görmek için platforma giriş yapabilirsiniz.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📬 Mail gönderildi. Sonuç:", result);
  } catch (error) {
    console.error('❌ Mail gönderme hatası:', error.message);
  }
};

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
