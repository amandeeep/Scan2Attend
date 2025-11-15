import express from 'express';
import { addSubject, getStudentSubjects, enrollStudents } from '../controllers/subjectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const subjectRouter = express.Router();

subjectRouter.post('/add', authMiddleware,addSubject);
subjectRouter.post('/enroll', authMiddleware, enrollStudents);
subjectRouter.post('/get-subjects/', authMiddleware, getStudentSubjects);
subjectRouter.post('/get-subjects/:id', authMiddleware, getStudentSubjects);

export default subjectRouter;