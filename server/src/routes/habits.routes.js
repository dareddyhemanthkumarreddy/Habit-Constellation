import { Router } from 'express';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../controllers/habits.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getHabits);
router.post('/', createHabit);
router.patch('/:id', updateHabit);
router.delete('/:id', deleteHabit);

export default router;
