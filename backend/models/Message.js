import mongoose from 'mongoose';

const messageSchema =  mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel', required: true },
  senderModel: { type: String, required: true, enum: ['Doctor', 'Patient'] },
  
  receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel', required: true },
  receiverModel: { type: String, required: true, enum: ['Doctor', 'Patient'] },
  
  text: { type: String, required: true },

  // Silme durumları, kullanıcı kendi tarafında silince true olur, diğer taraf için mesaj görünür kalır
  senderDeleted: { type: Boolean, default: false },
  receiverDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const MessageModel = mongoose.model('Message', messageSchema);
