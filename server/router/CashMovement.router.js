const express = require('express');
const router = express.Router();
const cashMovementController = require('../controllers/CashMovement.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')
// Routes related to Cash Movements
router.route('/')
  .get(authenticateToken, checkSubscription, cashMovementController.getAllCashMovements)
  .post(authenticateToken, checkSubscription, cashMovementController.createCashMovement);

router.route('/:id')
  .get(authenticateToken, checkSubscription, cashMovementController.getCashMovementById)
  .put(authenticateToken, checkSubscription, cashMovementController.updateCashMovement)
  .delete(authenticateToken, checkSubscription, cashMovementController.deleteCashMovement);

router.route('/transfer')
  .post(authenticateToken, checkSubscription, cashMovementController.transferCashBetweenRegisters);

module.exports = router;

