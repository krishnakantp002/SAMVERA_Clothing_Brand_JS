import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getTopProducts } from '../controllers/stats.controller';

const router = Router();

router.get('/top-products', authenticate, authorize(['ADMIN']), getTopProducts);

export default router;
