const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerByMobile,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} = require('../controllers/Customer.controller'); 
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')


router.route('/')
  .post(authenticateToken, checkSubscription, createCustomer)
  .get(authenticateToken, checkSubscription, getAllCustomers);

router.route('/:id')
  .get(authenticateToken, checkSubscription, getCustomerById)
  .put(authenticateToken, checkSubscription, updateCustomerById)
  .delete(authenticateToken, checkSubscription, deleteCustomerById);

router.route('/phone/:phone')
  .get(authenticateToken, checkSubscription, getCustomerByMobile);

module.exports = router;
