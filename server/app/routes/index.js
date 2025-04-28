const express = require("express");
const authRoutes = require("./auth.routes");
const issueRoutes = require("./issues.routes");
const voteRoutes = require("./votes.routes");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/issues", issueRoutes);
router.use("/votes", voteRoutes);

module.exports = router;
