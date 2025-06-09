import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getMessages,
  getNotifications,
  markAsRead,
  deleteMessageForMe,
} from '../controller/chatController.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/:otherUserId/:otherUserModel', protect, getMessages);
router.get('/notifications/all', protect, getNotifications);
router.patch('/read/:messageId', protect, markAsRead);
router.delete('/delete-for-me/:messageId', protect, deleteMessageForMe);

export default router;
