const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware.js");
const { getVotesByDate } = require("../services/vote.service");

// Get votes by date (for visualization)
router.get("/by-date", async (req, res) => {
  await getVotesByDate(req, res);
});

module.exports = router;
