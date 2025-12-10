const mongoose = require('mongoose');

const savedNoteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    noteId: { type: Number, required: true },
    noteTitle: { type: String, required: true },
    noteDescription: { type: String, required: true },
    fileType: { type: String, required: true },
    fileUrl: { type: String, required: true },
    thumbnail: { type: String },
    savedAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('SavedNote', savedNoteSchema);
