









import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    options: [{ type: String }],
    votes: { type:Number },
    status: { type: String, default: 'active' },
});

export default mongoose.model('Poll', PollSchema);
