const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    institute: { type: String },
    image: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Slide', slideSchema);
