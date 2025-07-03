import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String },
  replied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export default ContactMessage;
