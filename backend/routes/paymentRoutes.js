import express from 'express';
import { fakePayment } from '../controller/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/fake-payment', protect, fakePayment);

export default router;
