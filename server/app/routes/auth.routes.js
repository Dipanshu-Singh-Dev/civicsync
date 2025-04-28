const express = require("express");
const router = express.Router();
const authController = require("../services/auth.service.js");

// Register user
router.post("/signup", authController.signup);

// Login user
router.post("/login", authController.login);

// Logout user
router.post("/logout", authController.logout);

module.exports = router;
