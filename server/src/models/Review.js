const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    targetId: { type: mongoose.Schema.Types.Mixed, required: true }, // number or string
    targetType: { type: String, enum: ['course', 'teacher', 'class'], required: true },
    targetName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Review', reviewSchema);
