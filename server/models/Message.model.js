const mongoose = require('mongoose');

const customerMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlenght: 255
  },
  isSeen: {
    type: Boolean,
    default: false
  }
},
{timestamps : true});

const CustomerMessageModel = mongoose.model('CustomerMessage', customerMessageSchema);

module.exports = CustomerMessageModel;
