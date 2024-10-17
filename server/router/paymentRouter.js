import express from 'express';
import authMiddleWare from '../middleware/authMiddleware.js';
import { getAllStripePayments, processPayment, sendStripeApiKey } from '../controller/paymentController.js';
import { adminMiddleware } from '../middleware/admin-middleware.js';

const router = express.Router();

router.post('/process-payment', authMiddleWare, processPayment);
router.get('/stripe-api-key', authMiddleWare, sendStripeApiKey);
router.get('/get-all-payments', authMiddleWare,adminMiddleware,getAllStripePayments);

export default router;