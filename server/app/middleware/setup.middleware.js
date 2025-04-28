const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("../utils/logger");

/**
 * Custom request logging middleware that uses our centralized logger
 */
const requestLogger = (req, res, next) => {
  logger.logRequest(req);
  next();
};

/**
 * Configure application middleware
 * @param {Express} app - Express application instance
 */
function setupMiddleware(app) {
  // CORS configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true
    })
  );

  // Body parsing
  app.use(express.json());

  // Cookie parsing
  app.use(cookieParser());

  // Request logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")); // HTTP request logger
  }

  // Custom request logging
  app.use(requestLogger);
}

module.exports = setupMiddleware;
