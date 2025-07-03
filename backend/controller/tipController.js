import Tip from "../models/tipModel.js";
import path from "path";
import fs from "fs";

export const createTip = async (req, res) => {
  try {
    const { title, description } = req.body;
    let image = req.file?.filename;
    if (!title || !description || !image) {
      return res.status(400).json({ message: "Bütün xanalar doldurulmalıdır." });
    }
    const tip = await Tip.create({ title, description, image });
    res.status(201).json({ message: "Tip əlavə olundu", data: tip });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const getAllTips = async (req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const updateTip = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, keepOldImage, oldImage } = req.body;
    let updateData = { title, description };
    if (req.file?.filename) {
      // New image uploaded, delete old image if exists
      const tipDoc = await Tip.findById(id);
      if (tipDoc && tipDoc.image) {
        const oldPath = path.join('uploads/tips_photo', tipDoc.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = req.file.filename;
    } else if (keepOldImage === "true" && oldImage) {
      // No new image, keep the old one
      updateData.image = oldImage;
    }
    const tip = await Tip.findByIdAndUpdate(id, updateData, { new: true });
    if (!tip) return res.status(404).json({ message: "Tip tapılmadı." });
    res.json({ message: "Tip yeniləndi", data: tip });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

export const deleteTip = async (req, res) => {
  try {
    const { id } = req.params;
    const tip = await Tip.findByIdAndDelete(id);
    if (!tip) return res.status(404).json({ message: "Tip tapılmadı." });
    // Şəkli də sil
    if (tip.image && fs.existsSync(tip.image)) {
      fs.unlinkSync(tip.image);
    }
    res.json({ message: "Tip silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};
