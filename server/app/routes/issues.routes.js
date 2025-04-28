const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware.js");
// const { createIssue, getIssues } = require("../services/issues.service");

// create issue
router.post("/", protect, async (req, res) => {
  try {
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

module.exports = router;
