import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getMessages,
  getNotifications,
  markAsRead,
} from '../controller/chatController.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/:otherUserId', protect, getMessages);
router.get('/notifications/all', protect, getNotifications);
router.patch('/read/:messageId', protect, markAsRead);

export default router;
