import express from 'express';
import { getLimits, useLimit } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/limits', protect, getLimits);
router.post('/use-limit', protect, useLimit);

export default router;
