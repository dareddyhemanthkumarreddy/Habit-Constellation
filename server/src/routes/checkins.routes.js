import { Router } from 'express';
import { toggleCheckin, getCheckins } from '../controllers/checkins.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', toggleCheckin);
router.get('/', getCheckins);

export default router;
