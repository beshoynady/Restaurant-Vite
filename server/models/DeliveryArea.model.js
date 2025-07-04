const mongoose = require('mongoose');

const deliveryAreaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    delivery_fee: {
        type: Number,
        required: true,
        min: 0
    }
});

module.exports = mongoose.model('DeliveryArea', deliveryAreaSchema);