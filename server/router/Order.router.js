const express = require("express");
// const verifyJWT = require('../middleware/verifyjwt');
const router = express.Router();
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

// router.use(verifyJWT)
const {
    createOrder,
    getOrder,
    getOrders,
    getLimitOrders,
    updateOrder,
    deleteOrder
} = require("../controllers/Order.controller");


router.route("/").post(createOrder).get(getOrders);
router.route("/:id").get(getOrder)
    .put(updateOrder)
    .delete(authenticateToken, checkSubscription, deleteOrder);
router.route("/limit/:limit").get(getLimitOrders)
module.exports = router;