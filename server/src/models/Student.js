const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true },
    department: { type: String, required: true },
    session: { type: String, required: true },
    bloodGroup: String,
    phone: String,
    email: String,
    image: String, // URL
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
