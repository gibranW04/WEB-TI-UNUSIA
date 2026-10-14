import express from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

const loginRateLimiter = createRateLimiter();

router.post('/login', loginRateLimiter, login);
router.get('/me', authenticateToken, getProfile);

export default router;
