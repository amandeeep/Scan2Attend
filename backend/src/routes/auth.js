import express from 'express';
import { signup, login, logout, studentOnboard, sendOtp, verifyOtp, resetPassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/login', login)
authRouter.post('/signup', signup)
authRouter.post('/logout', logout)
authRouter.post('/studentOnboard',authMiddleware, studentOnboard)
authRouter.post('/send-otp', sendOtp)
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword)
export default authRouter;