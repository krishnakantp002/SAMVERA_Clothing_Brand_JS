import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getUsers } from '../controllers/user.controller';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getUsers);

export default router;
