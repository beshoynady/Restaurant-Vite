const express = require('express');
const router = express.Router();
const messageController = require('../controllers/Message.controller');
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, messageController.createClientMessage)
    .get(authenticateToken, checkSubscription, messageController.getAllClientMessages);

router.route('/:id')
    .get(authenticateToken, checkSubscription, messageController.getClientMessageById)
    .put(authenticateToken, checkSubscription, messageController.updateClientMessageById)
    .delete(authenticateToken, checkSubscription, messageController.deleteClientMessageById);

module.exports = router;
