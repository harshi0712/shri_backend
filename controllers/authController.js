


//for API...................
//////user data API 
////Handles user registration and login logic.


import User from '../models/userModel.js';  // Ensure this path is correct
import jwt from "jsonwebtoken";

// Register a new user
export const register = async (req, res) => {
    const { name,email, password } = req.body;
    try {
        const user = new User({ name,email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
};

// Log in a user and return a JWT token
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ error: 'User not found' });
        }else if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, "UserJwtSecretKey", { expiresIn: '1h' });
        res.json({token: token,  user_id: user._id});
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Server error' });
    }
};
