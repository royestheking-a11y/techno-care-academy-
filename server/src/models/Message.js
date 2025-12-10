const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: String,
    message: { type: String, required: true },
    status: { type: String, default: 'unread', enum: ['unread', 'read', 'replied'] },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Message', messageSchema);
