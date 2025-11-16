import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js'
import {connectDB} from './lib/db.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import profileRoutes from './routes/profile.js'
import subjectRouter from './routes/subject.js';
import attendanceRouter from './routes/attendance.js';

const PORT = process.env.PORT || 3001;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://scan2attend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
  },
  credentials: true,
}));

// app.use(cors({
//     origin: ["http://localhost:5173", "https://scan2attend.onrender.com", "http://localhost:3001", "https://scan2attend-backend.onrender.com"],
//     credentials: true
// }))
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/subject', subjectRouter);
app.use('/api/attendance',attendanceRouter);
app.get('/test', (req, res) => {
    res.send("API is working");
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
    connectDB()
})