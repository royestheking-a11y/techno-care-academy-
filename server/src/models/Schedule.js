const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    day: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    time: { type: String, required: true },
    platform: { type: String, required: true },
    link: { type: String, required: true },
    isLive: { type: Boolean, required: true }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
