import mongoose from 'mongoose';
import "dotenv/config"

export const connectDB = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MONGOOSE_URL);
        console.log(`MongoDB connected with ${connection.connection.host}`)
    }
    catch (err){
        console.log(err);
        
    }
}