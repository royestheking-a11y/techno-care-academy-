const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    bookId: { type: Number, required: true },
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
    bookPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    courseTitle: { type: String },
    courseDuration: { type: String },
    coursePrice: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema);
