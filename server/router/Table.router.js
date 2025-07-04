const express = require("express");
const { authenticateToken } = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

const {
  createTable,
  createQR,
  showAllTables,
  showOneTable,
  updateTable,
  deleteTable,
} = require("../controllers/Table.controller");

const router = express.Router();

router
  .route("/")
  .post(authenticateToken, checkSubscription, createTable)
  .get(showAllTables);
router
  .route("/:tableId")
  .get(showOneTable)
  .delete(authenticateToken, checkSubscription, deleteTable)
  .put(authenticateToken, checkSubscription, updateTable);
router.route("/qr").post(authenticateToken, checkSubscription, createQR);
module.exports = router;
