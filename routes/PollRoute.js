



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
router.get('/', authenticate, getAllPolls);
router.get('/:id', getPollById);
router.put('/:id', authenticate, updatePoll);
router.delete('/:id', authenticate, deletePoll);
router.post('/:id/vote', voteOnPoll);
router.get('/:id/results', getPollResults);

export default router;



