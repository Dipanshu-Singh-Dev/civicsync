const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware.js");
const {
  createIssue,
  getIssues,
  deleteIssue,
  upvoteIssue,
  downvoteIssue
} = require("../services/issues.service");

// create issue
router.post("/", protect, async (req, res) => {
  try {
    // Validate required fields
    const { title, description, category, location } = req.body;
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Required fields: title, description, category, location"
      });
    }

    const issue = await createIssue({ ...req.body, creatorId: req.user.id });
    return res.status(201).json({ success: true, data: issue });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating issue" });
  }
});

// fetch issues
router.get("/", protect, async (req, res) => {
  try {
    const issues = await getIssues(req.user.id);
    return res.status(200).json({ success: true, data: issues });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching issues" });
  }
});

// DELETE an issue
router.delete("/:id", protect, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    await deleteIssue(issueId, userId);

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    console.error("Delete issue error:", error);

    // Different error responses based on the error type
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error deleting issue",
      error: error.message
    });
  }
});

// UPVOTE an issue
router.post("/:id/upvote", protect, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    const updatedIssue = await upvoteIssue(issueId, userId);

    return res.status(200).json({
      success: true,
      message: "Upvote processed successfully",
      data: updatedIssue
    });
  } catch (error) {
    console.error("Upvote error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error processing upvote",
      error: error.message
    });
  }
});

// DOWNVOTE an issue
router.post("/:id/downvote", protect, async (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    const updatedIssue = await downvoteIssue(issueId, userId);

    return res.status(200).json({
      success: true,
      message: "Downvote processed successfully",
      data: updatedIssue
    });
  } catch (error) {
    console.error("Downvote error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error processing downvote",
      error: error.message
    });
  }
});

module.exports = router;
