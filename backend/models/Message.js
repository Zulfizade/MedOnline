import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel', required: true },
  senderModel: { type: String, required: true, enum: ['Doctor', 'Patient'] },

  receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel', required: true },
  receiverModel: { type: String, required: true, enum: ['Doctor', 'Patient'] },

  message: { type: String, required: true },

  isRead: { type: Boolean, default: false },

  // Silme durumları
  senderDeleted: { type: Boolean, default: false },
  receiverDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
