const express = require('express');
const router = express.Router();
const {
  createClient,
  getAllClients,
  getClientByMobile,
  getClientById,
  updateClientById,
  deleteClientById,
} = require('../controllers/Client.controller'); 
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')


router.route('/')
  .post(authenticateToken, checkSubscription, createClient)
  .get(authenticateToken, checkSubscription, getAllClients);

router.route('/:id')
  .get(authenticateToken, checkSubscription, getClientById)
  .put(authenticateToken, checkSubscription, updateClientById)
  .delete(authenticateToken, checkSubscription, deleteClientById);

router.route('/phone/:phone')
  .get(authenticateToken, checkSubscription, getClientByMobile);

module.exports = router;
