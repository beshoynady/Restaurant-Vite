const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cashRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employee: {
    type: ObjectId,
    ref: 'Employee',
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  }
}, {
  timestamps: true
});

const CashRegister = mongoose.model('CashRegister', cashRegisterSchema);

module.exports = CashRegister;
