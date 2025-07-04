const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    shiftType: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    hours: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

shiftSchema.pre('save', function(next) {
    const shift = this;
    const start = new Date(`1970-01-01T${shift.startTime}Z`);
    const end = new Date(`1970-01-01T${shift.endTime}Z`);
    const duration = (end - start) / (1000 * 60 * 60);
    shift.hours = duration > 0 ? duration : 24 + duration;
    next();
});

module.exports = mongoose.model('Shift', shiftSchema);
