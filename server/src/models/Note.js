const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    // id: { type: Number, required: true, unique: true }, // Removed to use MongoDB _id
    courseId: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'image', 'pptx'], required: true },
    fileUrl: { type: String }, // Optional now, for backward compatibility
    fileData: { type: Buffer }, // Binary data for the file
    contentType: { type: String }, // MIME type
    fileName: { type: String }, // Original filename
    size: { type: Number }, // File size in bytes
    thumbnail: String,
    createdAt: { type: Date, default: Date.now },
    tags: [String] // Added for English search
});

module.exports = mongoose.model('Note', noteSchema);
