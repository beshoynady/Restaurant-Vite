const express = require("express");
const { addEmployeeTransaction,
    getallEmployeeTransaction,
    getoneEmployeeTransaction,
    editEmployeeTransaction,
    deleteEmployeeTransaction } = require('../controllers/EmployeeTransactions.controller.js')
// const verifyJWT = require('../middleware/verifyjwt');
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')


const router = express.Router();

// router.use(verifyJWT)


router.route('/').post(authenticateToken, checkSubscription, addEmployeeTransaction).get(authenticateToken, checkSubscription, getallEmployeeTransaction);
router.route('/:employeetransactionsId').get(authenticateToken, checkSubscription, getoneEmployeeTransaction).put(authenticateToken, checkSubscription, editEmployeeTransaction).delete(authenticateToken, checkSubscription, deleteEmployeeTransaction);
module.exports = router;
