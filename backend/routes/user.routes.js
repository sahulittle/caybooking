import express from 'express';
import { signupUser, loginUser, getAllUsers } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
