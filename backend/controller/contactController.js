import ContactMessage from "../models/ContactMessage.js";
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, number, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Bütün xanalar doldurulmalıdır." });
    }
    const msg = await ContactMessage.create({ name, email, number, subject, message });
    res.status(201).json({ message: "Mesaj göndərildi", data: msg });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const replyToContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: "Cavab boş ola bilməz." });
    const message = await ContactMessage.findById(id);
    if (!message) return res.status(404).json({ message: "Mesaj tapılmadı." });
    message.reply = reply;
    message.replied = true;
    await message.save();

    // Email göndər
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: message.email,
      subject: `Cavab: ${message.subject}`,
      message: reply,
    });

    res.json({ message: "Cavab göndərildi və saxlanıldı." });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
