const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  deliveryArea: {
    type: ObjectId,
    ref: 'DeliveryArea',
    required: true
  },
  address: {
    type: String,
    required: true,
  },
  isVarified: {
    type: Boolean,
    default: false
  },
  refusesOrders: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
