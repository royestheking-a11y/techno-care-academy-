const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    courseId: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'image', 'pptx'], required: true },
    fileUrl: { type: String, required: true },
    thumbnail: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Note', noteSchema);
