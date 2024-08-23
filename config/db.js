import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database is connected....');
    } catch (err) {
        console.error('Database did not connect:', err);
       
    }
};
 
export default connectDB;