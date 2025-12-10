const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    courseId: { type: Number, required: true },
    courseName: { type: String },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    courseTitle: { type: String },
    courseDuration: { type: String },
    coursePrice: { type: mongoose.Schema.Types.Mixed } // Can be string or number based on TS interface
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
