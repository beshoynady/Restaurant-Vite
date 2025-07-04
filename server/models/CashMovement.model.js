const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const cashMovementSchema = new mongoose.Schema({
  registerId: {
    type: ObjectId,
    ref: 'CashRegister',
    required: true,
  },
  createdBy: {
    type: ObjectId,
    ref: 'Employee',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdraw', 'Revenue', 'Transfer', 'Expense', 'Payment', 'Refund'],
    required: true,
  },
  description: {
    type: String,
  },
  transferTo: {
    type: ObjectId,
    ref: 'CashRegister',
  },
  transferFrom: {
    type: ObjectId,
    ref: 'CashRegister',
  },
  movementId: {
    type: ObjectId,
    ref: 'CashMovement', 
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Rejected'],
    required: true,
    default: 'Completed',
  },
}, {
  timestamps: true
});

const CashMovement = mongoose.model('CashMovement', cashMovementSchema);

module.exports = CashMovement;
