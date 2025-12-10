const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, enum: ['class9', 'class10', 'polytechnic'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    meetingLink: { type: String, required: true },
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true },
    maxStudents: { type: Number },
    enrolledStudents: { type: Number },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
