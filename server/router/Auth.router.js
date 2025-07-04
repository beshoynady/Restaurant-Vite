const express = require("express");
const router = express.Router();
// const{signup, login, refresh, logout }= require('../controllers/Auth.controller');
const{signup, login }= require('../controllers/Auth.controller');


router.post('/signup',signup);
router.post('/login',login);
// router.get("/refresh",refresh);
// router.post("/logout",logout);

module.exports = router;

