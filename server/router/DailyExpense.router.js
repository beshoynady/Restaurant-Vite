const express = require('express');
const router = express.Router();
const dailyExpensesController = require('../controllers/DailyExpense.controller');
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

// Get all daily expenses
router.route('/').post(authenticateToken, checkSubscription, dailyExpensesController.addDailyExpense).get(authenticateToken, checkSubscription, dailyExpensesController.getAllDailyExpenses);

// Get one daily expense by ID
router.route('/:dailyexpenseId').get(authenticateToken, checkSubscription, dailyExpensesController.getDailyExpenseById).put(authenticateToken, checkSubscription, dailyExpensesController.updateDailyExpense).delete(authenticateToken, checkSubscription, dailyExpensesController.deleteDailyExpense)


module.exports = router;
