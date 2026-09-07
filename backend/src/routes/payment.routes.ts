import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// In production, these should likely be protected by authentication
// router.use(authenticate);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
