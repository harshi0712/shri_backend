import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv, { config } from 'dotenv';
import connectDB from './config/db.js';  // Import the connectDB function
import route from "./routes/PollRoute.js";
import authRouter from "./routes/authRoute.js";
import pollRouter from './routes/PollRoute.js';
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware (e.g., body-parser, cors)
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB connected successfully")
    })

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Polling System Backend!');
});
app.use("/user", authRouter);
// Additional routes can be added here

// localhost:3000/user/authRouter

// Start the server poll routes
app.use("/poll", pollRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






