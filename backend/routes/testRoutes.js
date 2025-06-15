import express from 'express';
import { sendOfflineEmailNotification } from '../utils/emailSender.js';

const router = express.Router();

router.get('/email/:userId', async (req, res) => {
  const { userId } = req.params;
  const testMessage = "Test mesajıdır, offline mail işlədi mi yoxlayırıq.";

  try {
    await sendOfflineEmailNotification(userId, testMessage);
    res.json({ success: true, message: "Mail funksiyası çağırıldı" });
  } catch (error) {
    console.error("Mail test hatası:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
