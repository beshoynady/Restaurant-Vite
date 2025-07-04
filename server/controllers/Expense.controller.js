const ExpenseModel = require('../models/Expense.model');

const createExpense = async (req, res) => {
  const { description, expenseType , isSalary } = req.body;

  try {
    const expense = await ExpenseModel.create({
      description,
      expenseType,
      isSalary
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateExpense = async (req, res) => {
  const { description, expenseType, isSalary } = req.body;

  try {
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(req.params.expenseId, { description, expenseType, isSalary }, { new: true });
    if (updatedExpense) {
      res.status(200).json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await ExpenseModel.findById(req.params.expenseId);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const removedExpense = await ExpenseModel.findByIdAndDelete(req.params.expenseId);
    if (removedExpense) {
      res.status(200).json(removedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
