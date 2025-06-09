import MessageModel from "../models/Message.js";

// Yeni mesaj gönderme
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, message } = req.body;
    console.log("Gelen veri:", req.body);
    const senderId = req.user.id;
    const senderModel = req.user.role === "doctor" ? "Doctor" : "Patient";

    if (!receiverId || !message || !receiverModel) {
      return res
        .status(400)
        .json({ message: "Alıcı, alıcı modeli ve mesaj zorunludur" });
    }

    const newMessage = new MessageModel({
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel,
      message,
    });

    await newMessage.save();

    // Burada socket.io ile gerçek zamanlı mesaj bildirimi yapabilirsin

    res.status(201).json({ message: "Mesaj gönderildi", newMessage });
  } catch (error) {
    console.error("Mesaj gönderme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Mesajları çek (iki kullanıcı arasındaki, silinmemiş mesajlar)
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";
    const { otherUserId, otherUserModel } = req.params;

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

    res.status(200).json(messages);
  } catch (error) {
    console.error("Mesajları çekme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
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

    res.status(200).json(unreadMessages);
  } catch (error) {
    console.error("Bildirim hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Mesajı okundu olarak işaretle
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await MessageModel.findById(messageId);

    if (!message || message.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Yetkisiz işlem" });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: "Mesaj okundu olarak işaretlendi" });
  } catch (error) {
    console.error("Okuma hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Mesajı sadece kendi tarafında sil (senderDeleted ya da receiverDeleted olarak işaretle)
export const deleteMessageForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "doctor" ? "Doctor" : "Patient";

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Mesaj bulunamadı" });
    }

    // Silme sadece kendi tarafında olmalı
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

    res.status(200).json({ message: "Mesaj kendi tarafınızdan silindi" });
  } catch (error) {
    console.error("Mesaj silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
