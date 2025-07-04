const express = require('express');
const router = express.Router();
const {
    createPurchaseInvoice,
    getAllPurchaseInvoices,
    getPurchaseInvoiceById,
    updatePurchaseInvoiceById,
    deletePurchaseInvoiceById
} = require('../controllers/Purchase.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

// Routes for purchase management
router.route('/')
    .post(authenticateToken, checkSubscription, createPurchaseInvoice)
    .get(authenticateToken, checkSubscription, getAllPurchaseInvoices);

router.route('/:id')
    .get(authenticateToken, checkSubscription, getPurchaseInvoiceById)
    .put(authenticateToken, checkSubscription, updatePurchaseInvoiceById)
    .delete(authenticateToken, checkSubscription, deletePurchaseInvoiceById);

module.exports = router;
