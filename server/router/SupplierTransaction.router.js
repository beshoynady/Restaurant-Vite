const express = require('express');
const router = express.Router();
const {
    createSupplierTransaction,
    getAllSupplierTransactions,
    getSupplierTransactionById,
    updateSupplierTransaction,
    deleteSupplierTransaction,
} = require('../controllers/SupplierTransaction.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, createSupplierTransaction)
    .get(authenticateToken, checkSubscription, getAllSupplierTransactions);

router.route('/:id')
    .get(authenticateToken, checkSubscription, getSupplierTransactionById)
    .put(authenticateToken, checkSubscription, updateSupplierTransaction)
    .delete(authenticateToken, checkSubscription, deleteSupplierTransaction);

    
module.exports = router;
