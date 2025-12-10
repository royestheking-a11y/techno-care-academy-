const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    website: { type: String },
    email: { type: String },
    programs: [{ type: String }],
    established: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() }
});

module.exports = mongoose.model('Institute', instituteSchema);
