const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    rating: { type: Number },
    students: { type: String },
    initial: { type: String },
    image: { type: String, required: true },
    category: { type: String, required: true }
});

module.exports = mongoose.model('Teacher', teacherSchema);
