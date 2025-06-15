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
router.get('/notifications/all', protect, getNotifications);  // önce spesifik route
router.get('/:otherUserId/:otherUserModel', protect, getMessages);  // sonra parametreli route
router.patch('/read/:messageId', protect, markAsRead);
router.delete('/delete-for-me/:messageId', protect, deleteMessageForMe);

export default router;
