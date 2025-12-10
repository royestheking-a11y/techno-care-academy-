const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    enrolled: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true }
});

module.exports = mongoose.model('Course', courseSchema);
