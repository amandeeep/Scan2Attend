import express from 'express'
import { profile } from "../controllers/profileController.js";
import {authMiddleware} from '../middleware/authMiddleware.js'

const profileRouter = express.Router();

profileRouter.post('/user', authMiddleware, profile)

export default profileRouter;