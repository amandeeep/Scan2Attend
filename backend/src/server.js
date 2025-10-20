import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js'
import {connectDB} from './lib/db.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import profileRoutes from './routes/profile.js'


const PORT = process.env.PORT;
const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/profile', profileRoutes)
app.get('/test', (req, res) => {
    res.send("API is working");
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
    connectDB()
})