import MessageModel from '../models/Message.js';

// Yeni mesaj gönderme
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id; // JWT'den gelen kullanıcı

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Alıcı ve mesaj zorunludur' });
    }

    const newMessage = new MessageModel({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    await newMessage.save();

    // Socket.io ile bildirim gönderilecekse burada emit edebilirsin (opsiyonel)
    // io.to(receiverId).emit('newMessage', newMessage);

    res.status(201).json({ message: 'Mesaj gönderildi', newMessage });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Mesajları çek (doktor ve hasta arasında olan tüm mesajlar)
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await MessageModel.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Mesajları çekme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Bildirimler: Okunmamış mesajları çek
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadMessages = await MessageModel.find({
      receiver: userId,
      isRead: false,
    }).populate('sender', 'name email role');

    res.status(200).json(unreadMessages);
  } catch (error) {
    console.error('Bildirim hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Mesajı okundu olarak işaretle
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await MessageModel.findById(messageId);

    if (!message || message.receiver.toString() !== userId) {
      return res.status(403).json({ message: 'Yetkisiz işlem' });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: 'Mesaj okundu olarak işaretlendi' });
  } catch (error) {
    console.error('Okuma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
