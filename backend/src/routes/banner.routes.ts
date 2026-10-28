import { Router } from 'express';
import { getBanners, createOrUpdateBanner } from '../controllers/banner.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getBanners);
router.post('/', authenticate, authorize(['ADMIN']), createOrUpdateBanner);

export default router;
