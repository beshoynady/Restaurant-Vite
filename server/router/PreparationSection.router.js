const express = require('express');
const router = express.Router();
const {
  createPreparationSection,
    getAllPreparationSections,
    getPreparationSectionById,
    updatePreparationSection,
    deletePreparationSection,
} = require('../controllers/PreparationSection.controller');

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require('../utlits/checkSubscription')

router.route('/')
  .post(authenticateToken, checkSubscription, createPreparationSection)
  .get(authenticateToken, checkSubscription, getAllPreparationSections);

router.route('/:id')

  .get(authenticateToken, checkSubscription, getPreparationSectionById)
  .put(authenticateToken, checkSubscription, updatePreparationSection)
  .delete(authenticateToken, checkSubscription, deletePreparationSection);

module.exports = router;
