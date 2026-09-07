import { Router } from 'express';
import { createCheckoutOrder } from '../controllers/order.controller';
// import { authenticate } from '../middleware/auth'; // Optional for guest checkout

const router = Router();

router.post('/', createCheckoutOrder);

export default router;
