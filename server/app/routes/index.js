const express = require("express");
const authRoutes = require("./auth.routes");
const issueRoutes = require("./issues.routes");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/issues", issueRoutes);

module.exports = router;
