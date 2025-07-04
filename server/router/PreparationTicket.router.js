const express = require("express");
const router = express.Router();
const {
  createPreparationTicket,
  getAllPreparationTickets,
  getActivePreparationTickets,
  getPreparationTicketById,
  updatePreparationTicket,
  deletePreparationTicket,
} = require("../controllers/PreparationTicket.controller");

const {authenticateToken} = require("../utlits/authenticate");
const checkSubscription = require("../utlits/checkSubscription");

router
  .route("/")
  .post(authenticateToken, checkSubscription, createPreparationTicket)
  .get(authenticateToken, checkSubscription, getAllPreparationTickets);

router
  .route("/activepreparationtickets")
  .get(authenticateToken, checkSubscription, getActivePreparationTickets);

router
  .route("/:id")

  .get(authenticateToken, checkSubscription, getPreparationTicketById)
  .put(authenticateToken, checkSubscription, updatePreparationTicket)
  .delete(authenticateToken, checkSubscription, deletePreparationTicket);

module.exports = router;
