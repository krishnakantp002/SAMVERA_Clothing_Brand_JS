import { Router } from 'express';
import { getProducts, getProductBySlug, getCategories, updateCategory, createProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.patch('/categories/:id', authenticate, authorize(['ADMIN']), updateCategory);
router.get('/:slug', getProductBySlug);

// Admin routes
router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProduct);

export default router;
