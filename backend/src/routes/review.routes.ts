import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// /api/reviews
router.get('/:productId', getProductReviews);
router.post('/:productId', authenticate, createReview);

export default router;
