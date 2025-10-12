import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js'
import {connectDB} from './lib/db.js'


const PORT = process.env.PORT;
const app = express();



app.use('/api/auth',authRoutes);

app.listen(PORT, () => {
    console.log(`Sever is listening at port ${PORT}`),
    connectDB()
})