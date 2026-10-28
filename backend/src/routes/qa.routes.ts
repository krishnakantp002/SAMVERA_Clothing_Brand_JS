import { Router } from 'express';
import { getProductQuestions, askQuestion, getAllQuestions, answerQuestion } from '../controllers/qa.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public / User routes
router.get('/product/:productId', getProductQuestions);
router.post('/product/:productId', askQuestion); // We don't require auth here, we can accept guest questions if they provide email/name, or we use auth optionally

// Admin routes
router.get('/', authenticate, authorize(['ADMIN']), getAllQuestions);
router.patch('/:id/answer', authenticate, authorize(['ADMIN']), answerQuestion);

export default router;
