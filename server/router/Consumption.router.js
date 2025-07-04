const express = require("express");
const router = express.Router();
const {
  getAllConsumptions,
  getConsumptionById,
  getConsumptionBySection,
  createConsumption,
  updateConsumptionById,
  deleteConsumptionById,
} = require("../controllers/Consumption.controller");

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

// Define routes using router.route for Kitchen Consumptions
router
  .route("/")
  .get(authenticateToken, checkSubscription, getAllConsumptions)
  .post(authenticateToken, checkSubscription, createConsumption);

router
  .route("/:id")
  .get(authenticateToken, checkSubscription, getConsumptionById)
  .put(authenticateToken, checkSubscription, updateConsumptionById)
  .delete(authenticateToken, checkSubscription, deleteConsumptionById);

router
  .route("/bysection/:sectionId")
  .get(authenticateToken, checkSubscription, getConsumptionBySection)

module.exports = router;
