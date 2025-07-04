const express = require('express');
const router = express.Router();
const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplierById,
    deleteSupplierById
} = require('../controllers/Supplier.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, createSupplier)
    .get(authenticateToken, checkSubscription, getAllSuppliers);

router.route('/:id')
    .get(authenticateToken, checkSubscription, getSupplierById)
    .put(authenticateToken, checkSubscription, updateSupplierById)
    .delete(authenticateToken, checkSubscription, deleteSupplierById);

module.exports = router;
