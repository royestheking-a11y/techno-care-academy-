const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: String, required: true },
    originalPrice: { type: String },
    discount: { type: String },
    image: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    description: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);
