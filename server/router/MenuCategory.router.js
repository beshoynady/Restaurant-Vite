const express = require("express");
const {
  createMenuCategory,
  getAllMenuCategories,
  getOneMenuCategory,
  updateMenuCategory,
  deleteMenuCategory
} = require("../controllers/MenuCategory.controller");
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

const router = express.Router();

router.route('/').post(authenticateToken, checkSubscription, createMenuCategory)
  .get(getAllMenuCategories);
router.route('/:menuCategoryId')
  .get(getOneMenuCategory)
  .put(authenticateToken, checkSubscription, updateMenuCategory)
  .delete(authenticateToken, checkSubscription, deleteMenuCategory);

module.exports = router;
