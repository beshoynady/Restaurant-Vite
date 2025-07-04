const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    unique: true,
  },
  expenseType: {
    type: String,
    required: true,
    enum: ['Operating Expenses', 'Fixed Expenses', 'Marketing and Advertising', 'Administrative and Office Expenses', 'Investment and Development'],
  },
  isSalary:{
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

const ExpenseModel = mongoose.model('Expense', expenseSchema);

module.exports = ExpenseModel;
