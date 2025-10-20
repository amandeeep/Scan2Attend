import express from 'express'
import { studentProfile } from "../controllers/profileController.js";
import {authMiddleware} from '../middleware/authMiddleware.js'

const profileRouter = express.Router();

profileRouter.post('/student', authMiddleware, studentProfile)

export default profileRouter;