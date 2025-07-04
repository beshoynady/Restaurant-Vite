const express = require("express");
const router = express.Router();
const {
  createFirstEmployee,
  createEmployee,
  updateEmployee,
  getOneEmployee,
  loginEmployee,
  getAllEmployee,
  getCountEmployees,
  deleteEmployee,
} = require("../controllers/Employee.controller.js");

const {authenticateToken, refreshAccessToken} = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

router.route("/create-first").post(createFirstEmployee);
router.route("/count").get(getCountEmployees);

router
  .route("/")
  .post(authenticateToken, checkSubscription, createEmployee)
  .get(authenticateToken, checkSubscription, getAllEmployee);

router
  .route("/:employeeId")
  .get(authenticateToken, checkSubscription, getOneEmployee)
  .put(authenticateToken, checkSubscription, updateEmployee)
  .delete(authenticateToken, checkSubscription, deleteEmployee);

router.route("/login").post(loginEmployee);
router.route("/refresh-token").post(refreshAccessToken);
module.exports = router;
