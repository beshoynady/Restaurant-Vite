const express = require('express');
const router = express.Router();
const messageController = require('../controllers/Message.controller');
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, messageController.createCustomerMessage)
    .get(authenticateToken, checkSubscription, messageController.getAllCustomerMessages);

router.route('/:id')
    .get(authenticateToken, checkSubscription, messageController.getCustomerMessageById)
    .put(authenticateToken, checkSubscription, messageController.updateCustomerMessageById)
    .delete(authenticateToken, checkSubscription, messageController.deleteCustomerMessageById);

module.exports = router;
