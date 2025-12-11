const express = require('express');
const router = express.Router();
const multer = require('multer');
const Note = require('../models/Note');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Create a new note with file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { title, description, courseId, fileType, thumbnail } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const newNote = new Note({
            title,
            description,
            courseId,
            fileType,
            thumbnail,
            fileData: req.file.buffer,
            contentType: req.file.mimetype,
            fileName: req.file.originalname,
            size: req.file.size
        });

        // Auto-generate fileUrl for download
        newNote.fileUrl = `/api/notes/${newNote._id}/download`;

        const savedNote = await newNote.save();

        // Return note without fileData to keep response light
        const noteResponse = savedNote.toObject();
        delete noteResponse.fileData;

        res.status(201).json(noteResponse);
    } catch (error) {
        console.error('Error uploading note:', error);
        res.status(500).json({ message: error.message });
    }
});

// Download note file
router.get('/:id/download', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note || !note.fileData) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.set({
            'Content-Type': note.contentType,
            'Content-Disposition': `attachment; filename="${note.fileName}"`,
            'Content-Length': note.size
        });

        res.send(note.fileData);
    } catch (error) {
        console.error('Error downloading note:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update an existing note (metadata only or with new file)
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const updates = { ...req.body };

        if (req.file) {
            updates.fileData = req.file.buffer;
            updates.contentType = req.file.mimetype;
            updates.fileName = req.file.originalname;
            updates.fileName = req.file.originalname;
            updates.size = req.file.size;
            updates.fileUrl = `/api/notes/${req.params.id}/download`;
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select('-fileData'); // Exclude fileData from response

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List notes (exclude fileData for performance)
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().select('-fileData').sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
