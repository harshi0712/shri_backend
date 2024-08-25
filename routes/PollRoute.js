import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
    createPoll,
    getAllPolls,
    getPollById,
    updatePoll,
    deletePoll,
    voteOnPoll,
    getPollResults
} from '../controllers/pollController.js';


const router = express.Router();

// Poll routes
router.post('/create', createPoll);
router.get('/', getAllPolls);
router.get('/:id', getPollById);
router.put('/:id', updatePoll);
router.delete('/:id', deletePoll);
router.post('/vote/:id', voteOnPoll);
router.get('/results/:id', getPollResults);

export default router;



