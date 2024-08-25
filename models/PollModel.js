import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 } // Track votes for each option
});

const PollSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    options: { type: [OptionSchema], required: true },  // Using an array of OptionSchema
    status: { 
        type: String, 
        enum: ['active', 'inactive'],  // Only allows these values
        default: 'active' 
    },
    votesByUser: { 
        type: Map, 
        of: String, 
        default: {}  // Initialize as an empty map to store user votes
    },
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

export default mongoose.model('Poll', PollSchema);
