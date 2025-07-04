const DailyExpenseModel = require('../models/DailyExpense.model');

// Get all daily expenses
exports.getAllDailyExpenses = async (req, res) => {
  try {
    const dailyExpenses = await DailyExpenseModel.find()
    .populate('paidBy', '_id fullname username role')
    .populate('expenseId', '_id description expenseType')
    .populate('cashRegister', '_id name') 
    .populate('cashMovementId');
  res.status(200).json(dailyExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one daily expense by ID
exports.getDailyExpenseById = async (req, res) => {
  try {
    const dailyExpense = await DailyExpenseModel.findById(req.params.dailyexpenseId)
      .populate('paidBy', '_id fullname username role')
      .populate('expenseId', '_id description expenseType')
      .populate('cashRegister', '_id name') 
      .populate('cashMovementId');
    if (dailyExpense) {
      res.status(200).json(dailyExpense);
    } else {
      res.status(404).json({ message: 'Daily expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new daily expense
exports.addDailyExpense = async (req, res) => {
  const { expenseId, expenseDescription, cashRegister, cashMovementId, paidBy, amount, notes, date } = req.body;

  try {
    const newDailyExpense = await DailyExpenseModel.create({
      expenseId,
      expenseDescription,
      cashRegister,
      cashMovementId,
      paidBy,
      amount,
      notes,
      date
    });

    res.status(201).json(newDailyExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a daily expense by ID
exports.updateDailyExpense = async (req, res) => {
  const { expenseId, expenseDescription, cashRegister, paidBy, amount, notes, date } = req.body;

  try {
    const updatedDailyExpense = await DailyExpenseModel.findByIdAndUpdate(
      req.params.dailyexpenseId,
      {
        expenseId,
        expenseDescription,
        cashRegister,
        paidBy,
        amount,
        notes,
      },
      { new: true }
    );

    if (updatedDailyExpense) {
      res.status(200).json(updatedDailyExpense);
    } else {
      res.status(404).json({ message: 'Daily expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Delete a daily expense by ID
exports.deleteDailyExpense = async (req, res) => {
  try {
    const removedDailyExpense = await DailyExpenseModel.findByIdAndRemove(req.params.dailyexpenseId);
    if (removedDailyExpense) {
      res.status(200).json(removedDailyExpense);
    } else {
      res.status(404).json({ message: 'Daily expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
