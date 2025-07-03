// controllers/messageController.js

import mongoose from "mongoose";
import MessageModel from "../models/Message.js";
import PatientModel from "../models/patientModel.js";
import DoctorModel from "../models/doctorModel.js";


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
// Mesajı oxundu kimi işarələmək əvəzinə, oxunan mesajı silirik (bildiriş siyahısından tamamilə çıxır)
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

    // Yalnız alıcı öz mesajını silə bilər (hər ikisini stringə çevir)
    if (message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Yetkisiz işlem" });
    }

    // Mesajı silmə! Yalnız oxundu kimi işarələ
    message.isRead = true;
    await message.save();
    return res.status(200).json({ message: "Mesaj oxundu kimi işarələndi" });
  } catch (error) {
    console.error("Okuma/silme hatası:", error);
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
      message.sender.toString() === userId.toString() &&
      message.senderModel === userModel
    ) {
      message.senderDeleted = true;
    } else if (
      message.receiver.toString() === userId.toString() &&
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

// Tüm mesajları çek
export const getAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";
    const messages = await MessageModel.find({
      $or: [
        { sender: userId, senderModel: userModel, senderDeleted: false },
        { receiver: userId, receiverModel: userModel, receiverDeleted: false },
      ],
    })
      .populate("sender", "name email role profilePhoto")
      .populate("receiver", "name email role profilePhoto")
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
