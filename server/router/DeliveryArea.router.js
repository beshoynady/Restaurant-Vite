const express = require('express');
const router = express.Router();
const {
    createDeliveryArea,
    getAllDeliveryAreas,
    getDeliveryAreaById,
    updateDeliveryArea,
    deleteDeliveryArea
} = require('../controllers/DeliveryArea.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')


router.route("/").post(authenticateToken, checkSubscription, createDeliveryArea)
    .get(getAllDeliveryAreas);

router.route("/:id").get(authenticateToken, checkSubscription, getDeliveryAreaById)
    .put(authenticateToken, checkSubscription, updateDeliveryArea)
    .delete(authenticateToken, checkSubscription, deleteDeliveryArea);



module.exports = router;
