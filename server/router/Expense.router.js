const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/Expense.controller');
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')


router.route("/")
    .post(authenticateToken, checkSubscription, expensesController.createExpense)
    .get(authenticateToken, checkSubscription, expensesController.getAllExpenses);
router.route("/:expenseId")
    .get(authenticateToken, checkSubscription, expensesController.getExpenseById)
    .put(authenticateToken, checkSubscription, expensesController.updateExpense)
    .delete(authenticateToken, checkSubscription, expensesController.deleteExpense);



module.exports = router;
