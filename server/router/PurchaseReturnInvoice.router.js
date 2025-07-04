const express = require('express');
const router = express.Router();
const {
    createPurchaseReturnInvoice,
    getAllPurchaseReturnInvoices,
    getPurchaseReturnInvoiceById,
    updatePurchaseReturnInvoiceById,
    deletePurchaseReturnInvoiceById
} = require('../controllers/PurchaseReturn.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

// Routes for purchase return management
router.route('/')
    .post(authenticateToken, checkSubscription, createPurchaseReturnInvoice)
    .get(authenticateToken, checkSubscription, getAllPurchaseReturnInvoices);

router.route('/:id')
    .get(authenticateToken, checkSubscription, getPurchaseReturnInvoiceById)
    .put(authenticateToken, checkSubscription, updatePurchaseReturnInvoiceById)
    .delete(authenticateToken, checkSubscription, deletePurchaseReturnInvoiceById);

module.exports = router;
