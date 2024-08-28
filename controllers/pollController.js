////////////Handles poll CRUD operations, voting, and results retrieval.

import Poll from "../models/PollModel.js";
//mport jwt from "jsonwebtoken"; // Assuming you're using this for JWT operations
import authenticate from "../middleware/authenticate.js";

const createPoll = async (req, res) => {
  console.log("req", req);
  console.log(req.body);

  const { title, description, options, user } = req.body;

  // Validate the options format
  if (
    !Array.isArray(options) ||
    options.some((opt) => typeof opt.text !== "string")
  ) {
    return res.status(400).json({ error: "Invalid options format" });
  }

  try {
    const poll = new Poll({
      title,
      description,
      options,
      user,
      votesByUser: new Map(), // Initialize votesByUser as an empty Map
    });

    const result = await poll.save();
    console.log(result);

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error creating poll" });
  }
};

// Retrieve all polls
const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: "Error fetching polls" });
  }
};

// Retrieve a single poll by ID
const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: "Error fetching poll" });
  }
};

// Update a poll by ID
const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (error) {
    res.status(400).json({ error: "Error updating poll" });
  }
};

// Delete a poll by ID
const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting poll" });
  }
};

const voteOnPoll = async (req, res) => {
  const { userId, option_id } = req.body; // Extract userId and optionText from the request body
  const user = userId;

  try {

    const poll = await Poll.findById(req.params.id);
    if (!poll || poll.status !== "active") {
      return res.status(400).json({ error: "Invalid poll" });
    }

    // Check if the user has already voted
    if (poll.votesByUser.has(user)) {
      return res.status(400).json({ error: "User has already voted" });
    }

    console.log('option_id', option_id, poll.options)

    // Find the option by text
    const option = poll.options.find((opt) => opt._id == option_id);
    if (!option) {
      return res.status(400).json({ error: "Option not found" });
    }

    console.log(userId, option_id);
    
    // Increment the vote count
    option.votes = (option.votes || 0) + 1;
    poll.votesByUser.set(user, option_id); // Record user's vote
    await poll.save();

    res.json({ message: "Vote recorded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error recording vote" });
  }
};


const getPollResults = async (req, res) => {
  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid poll ID" });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Calculate total votes
    const totalVotes = poll.options.reduce((total, option) => total + (option.votes || 0), 0);

    // Calculate percentage for each option
    const results = poll.options.map(option => ({
      text: option.text,
      votes: option.votes || 0,
      percentage: totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0
    }));

    res.json(results);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error fetching results" });
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
