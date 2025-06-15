// controllers/messageController.js

import mongoose from "mongoose";
import MessageModel from "../models/Message.js";
import PatientModel from "../models/patientModel.js";
import DoctorModel from "../models/doctorModel.js";
import { sendOfflineEmailNotification } from "../utils/emailSender.js";

// MongoDB ObjectId kontrolü
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Mesaj gönderme
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;
    const senderModel = req.user.role === "doctor" ? "Doctor" : "Patient";

    if (!receiverId || !message) {
      return res.status(400).json({ message: "Alıcı ve mesaj zorunludur" });
    }

    if (!isValidObjectId(receiverId)) {
      return res.status(400).json({ message: "Geçersiz alıcı ID'si" });
    }

    // Alıcının modelini belirle
    let receiverModel;
    if (await PatientModel.exists({ _id: receiverId })) {
      receiverModel = "Patient";
    } else if (await DoctorModel.exists({ _id: receiverId })) {
      receiverModel = "Doctor";
    } else {
      return res.status(404).json({ message: "Alıcı bulunamadı" });
    }

    const newMessage = new MessageModel({
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel,
      message,
    });

    await newMessage.save();

    // Mail bildirimi gönder
    try {
      await sendOfflineEmailNotification(receiverId, message);
      console.log("📧 Mail bildirimi gönderildi.");
    } catch (emailError) {
      console.error("❌ Mail gönderme hatası:", emailError);
    }

    return res.status(201).json({ message: "Mesaj gönderildi", newMessage });
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Mesajları çek (iki kullanıcı arasında)
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";
    const { otherUserId } = req.params;

    if (!isValidObjectId(otherUserId)) {
      return res.status(400).json({ message: "Geçersiz kullanıcı ID'si" });
    }

    let otherUserModel;
    if (await PatientModel.exists({ _id: otherUserId })) {
      otherUserModel = "Patient";
    } else if (await DoctorModel.exists({ _id: otherUserId })) {
      otherUserModel = "Doctor";
    } else {
      return res.status(404).json({ message: "Karşı kullanıcı bulunamadı" });
    }

    const messages = await MessageModel.find({
      $or: [
        {
          sender: userId,
          senderModel: userModel,
          receiver: otherUserId,
          receiverModel: otherUserModel,
          senderDeleted: false,
        },
        {
          sender: otherUserId,
          senderModel: otherUserModel,
          receiver: userId,
          receiverModel: userModel,
          receiverDeleted: false,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Mesajları çekme hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Okunmamış mesajları çek
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";

    const unreadMessages = await MessageModel.find({
      receiver: userId,
      receiverModel: userModel,
      isRead: false,
      receiverDeleted: false,
    }).populate("sender", "name email role");

    return res.status(200).json(unreadMessages);
  } catch (error) {
    console.error("Bildirim hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Mesajı okundu olarak işaretle
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    if (!isValidObjectId(messageId)) {
      return res.status(400).json({ message: "Geçersiz mesaj ID'si" });
    }

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    if (message.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Yetkisiz işlem" });
    }

    message.isRead = true;
    await message.save();

    return res.status(200).json({ message: "Mesaj okundu olarak işaretlendi" });
  } catch (error) {
    console.error("Okuma hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Mesajı sadece kendi tarafında sil
export const deleteMessageForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";

    if (!isValidObjectId(messageId)) {
      return res.status(400).json({ message: "Geçersiz mesaj ID'si" });
    }

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    if (
      message.sender.toString() === userId &&
      message.senderModel === userModel
    ) {
      message.senderDeleted = true;
    } else if (
      message.receiver.toString() === userId &&
      message.receiverModel === userModel
    ) {
      message.receiverDeleted = true;
    } else {
      return res.status(403).json({ message: "Yetkisiz işlem" });
    }

    await message.save();

    return res.status(200).json({ message: "Mesaj kendi tarafınızdan silindi" });
  } catch (error) {
    console.error("Mesaj silme hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};
