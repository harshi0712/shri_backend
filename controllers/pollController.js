

////////////Handles poll CRUD operations, voting, and results retrieval.


import Poll from '../models/PollModel.js';
import jwt from 'jsonwebtoken'; // Assuming you're using this for JWT operations
import authenticate from "../middleware/authenticate.js";
const jwtSecret = 'your_jwt_secret'; // Define your JWT secret here

// Middleware to authenticate JWT

// Create a new poll
const createPoll = async (req, res) => {
    console.log(req.body);
    const { title, description, options,votes } = req.body;
    
    try {
        const poll = new Poll({
            title,
            description,
            options,
            votes
        });
      const result= await poll.save();
      console.log(result);
      
        
        res.status(201).json(poll);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Error creating poll' });
    }
};

// Retrieve all polls
const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching polls' });
    }
};

// Retrieve a single poll by ID
const getPollById = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        res.json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching poll' });
    }
};

// Update a poll by ID
const updatePoll = async (req, res) => {
    try {
        const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        res.json(poll);
    } catch (error) {
        res.status(400).json({ error: 'Error updating poll' });
    }
};

// Delete a poll by ID
const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findByIdAndDelete(req.params.id);
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        res.json({ message: 'Poll deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting poll' });
    }
};

// Vote on a poll
const voteOnPoll = async (req, res) => {
    const { option } = req.body;
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll || !poll.options.includes(option) || poll.status !== 'active') {
            return res.status(400).json({ error: 'Invalid poll or option' });
        }
        poll.votes[option] = (poll.votes[option] || 0) + 1;
        await poll.save();
        res.json({ message: 'Vote recorded' });
    } catch (error) {
        res.status(500).json({ error: 'Error recording vote' });
    }
};

// Get results of a poll
const getPollResults = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        res.json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching results' });
    }
};

export {
    createPoll,
    getAllPolls,
    getPollById,
    updatePoll,
    deletePoll,
    voteOnPoll,
    getPollResults,
    authenticate,
};
