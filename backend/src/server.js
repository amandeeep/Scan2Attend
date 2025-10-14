import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js'
import {connectDB} from './lib/db.js'
import cookieParser from "cookie-parser";


const PORT = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',authRoutes);

app.get('/test', (req, res) => {
    res.send("API is working");
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
    connectDB()
})