const express = require("express");
const {
  CreateCategoryStock,
  getallcategoryStock,
  getonecategoryStock,
  updatecategoryStock,
  deleteCategoryStock,
} = require("../controllers/CategoryStock.controller");

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

const router = express.Router();

router.route('/').post(authenticateToken, checkSubscription, CreateCategoryStock).get(authenticateToken, checkSubscription, getallcategoryStock);
router.route('/:categoryStockId').get(authenticateToken, checkSubscription, getonecategoryStock).put(authenticateToken, checkSubscription, updatecategoryStock).delete(authenticateToken, checkSubscription, deleteCategoryStock);

module.exports = router;
