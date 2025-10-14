import express from 'express';
import { signup, login, logout, studentOnboard } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/login', login)
authRouter.post('/signup', signup)
authRouter.post('/logout', logout)
authRouter.post('/studentOnboard',authMiddleware, studentOnboard)

export default authRouter;