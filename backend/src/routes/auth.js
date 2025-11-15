import express from 'express';
import { signup, login, logout, sendOtp, verifyOtp, resetPassword, addUser, onboard } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadImage } from "../middleware/multerMiddleware.js";
const authRouter = express.Router();

authRouter.post('/login', login)
authRouter.post('/signup', signup)
authRouter.post('/logout', logout)
// authRouter.post('/studentOnboard',authMiddleware, studentOnboard)
authRouter.post('/onboard', authMiddleware, uploadImage.single("profilePic"), onboard) // vvvvv
authRouter.post('/send-otp', sendOtp)
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/addUser',authMiddleware, addUser)
export default authRouter;