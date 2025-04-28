const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware.js");
const issueController = require("../controllers/issue.controller");

// Create issue
router.post("/", protect, issueController.createIssue);

// Fetch issues
router.get("/", protect, issueController.getIssues);

// Delete an issue
router.delete("/:id", protect, issueController.deleteIssue);

// Upvote an issue
router.post("/:id/upvote", protect, issueController.upvoteIssue);

// Downvote an issue
router.post("/:id/downvote", protect, issueController.downvoteIssue);

module.exports = router;
