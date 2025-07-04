const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');
const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
    .post(authenticateToken, checkSubscription, recipeController.createRecipe)
    .get(authenticateToken, checkSubscription, recipeController.getAllRecipe);

router.route('/:id')
    .get(authenticateToken, checkSubscription, recipeController.getOneRecipe)
    .put(authenticateToken, checkSubscription, recipeController.updateRecipe)
    .delete(authenticateToken, checkSubscription, recipeController.deleteRecipe);

module.exports = router;
