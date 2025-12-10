const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping existing string ID for compatibility
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isVerified: { type: Boolean },
    isDisabled: { type: Boolean }
});

module.exports = mongoose.model('User', userSchema);
