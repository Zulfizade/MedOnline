import mongoose from "mongoose";

const tipSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Tip = mongoose.model("Tip", tipSchema);
export default Tip;
