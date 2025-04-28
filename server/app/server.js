require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const Routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");
const setupMiddleware = require("./middleware/setup.middleware");
const responseMiddleware = require("./middleware/response.middleware");

// Initialize express app
const app = express();

// Apply middleware
setupMiddleware(app);

// Add response format helpers
app.use(responseMiddleware);

// Routes
app.use("/api", Routes);

// Default route
app.get("/", (req, res) => {
  res.ok("Civicsync API is running");
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
