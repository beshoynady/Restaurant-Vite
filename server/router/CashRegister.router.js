const express = require('express');
const router = express.Router();
const cashRegisterController = require('../controllers/CashRegister.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

// Routes related to Cash Register
router.route('/')
  .post(authenticateToken, checkSubscription, cashRegisterController.createCashRegister)
  .get(authenticateToken, checkSubscription, cashRegisterController.getAllCashRegisters);

router.route('/:id')
  .get(authenticateToken, checkSubscription, cashRegisterController.getCashRegisterById)
  .put(authenticateToken , cashRegisterController.updateCashRegister)
  .delete(authenticateToken, checkSubscription, cashRegisterController.deleteCashRegister);
router.route('/employee/:employeeId')
  .get(authenticateToken, checkSubscription, cashRegisterController.getCashRegistersByEmployee)

module.exports = router;

