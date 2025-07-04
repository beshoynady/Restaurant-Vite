const router = require("express").Router();

const {
  createProductionOrder,
  getProductionOrdersByStore,
  getProductionOrdersByPreparationSection,
  getProductionOrders,
  getProductionOrder,
  updateProductionOrder,
  updateProductionStatus,
  deleteProductionOrder,
} = require("../controllers/ProductionOrder.controller");

const { authenticateToken } = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

// Create a new Production Order
router
  .route("/")
  .post(authenticateToken, checkSubscription, createProductionOrder)
  .get(authenticateToken, checkSubscription, getProductionOrders);

router
  .route("/:id")
  .get(authenticateToken, checkSubscription, getProductionOrder)
  .put(authenticateToken, checkSubscription, updateProductionOrder)
  .delete(authenticateToken, checkSubscription, deleteProductionOrder);

router
  .route("/store/:storeId")
  .get(authenticateToken, checkSubscription, getProductionOrdersByStore);

router
  .route("/section/:sectionId")
  .get(authenticateToken, checkSubscription, getProductionOrdersByPreparationSection);

router
  .route("/status/:id")
  .put(authenticateToken, checkSubscription, updateProductionStatus);

module.exports = router;

