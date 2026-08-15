import { Router } from 'express';
import { generateInsight, getLatestInsight, getInsightHistory } from '../controllers/insights.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/generate', generateInsight);
router.get('/latest', getLatestInsight);
router.get('/', getInsightHistory);

export default router;
