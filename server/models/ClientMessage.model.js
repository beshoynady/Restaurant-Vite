const mongoose = require('mongoose');

const clientMessageSchema = new mongoose.Schema({
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

const ClientMessageModel = mongoose.model('ClientMessage', clientMessageSchema);

module.exports = ClientMessageModel;
