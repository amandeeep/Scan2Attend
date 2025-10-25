import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { markAttendance, getAttendance,updateAttendance } from '../controllers/attendanceController.js'

const attendanceRouter = express.Router();

attendanceRouter.post('/mark',authMiddleware, markAttendance);
attendanceRouter.get('/view',authMiddleware, getAttendance);
attendanceRouter.put('/update',authMiddleware, updateAttendance);

export default attendanceRouter;