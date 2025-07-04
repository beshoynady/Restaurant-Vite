const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// Define the schema for daily expenses
const dailyExpenseSchema = new mongoose.Schema({
    expenseId: {
        type: ObjectId,
        ref: 'Expense',
        required: true,
    },
    expenseDescription: {
        type: String,
        required: true,
    },
    cashRegister: {
        type: ObjectId,
        ref: 'CashRegister',
        required: true,
    },
    cashMovementId: {
        type: ObjectId,
        ref: 'CashMovement',
        required: true,
      },
    paidBy: {
        type: ObjectId,
        ref: 'Employee',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    notes: String,
    date: {
        type: Date,
        default: Date.now
    },
},
{
  timestamps: true,
});

// Create a model based on the schema
const DailyExpenseModel = mongoose.model('DailyExpense', dailyExpenseSchema);

// Export the model
module.exports = DailyExpenseModel;
