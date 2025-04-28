/**
 * Logger utility for standardized logging across the application
 * Abstracts console output to allow for easier changes to logging implementation
 */

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Log an info message
 * @param {string} message - The message to log
 * @param {Object} [data] - Optional data to include
 */
const info = (message, data) => {
  console.log(`[INFO] ${message}`, data ? data : "");
};

/**
 * Log a warning message
 * @param {string} message - The message to log
 * @param {Object} [data] - Optional data to include
 */
const warn = (message, data) => {
  console.warn(`[WARN] ${message}`, data ? data : "");
};

/**
 * Log an error message
 * @param {string} message - The message to log
 * @param {Error|Object} [error] - Optional error to include
 */
const error = (message, error) => {
  console.error(`[ERROR] ${message}`);

  if (error) {
    if (error instanceof Error) {
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error("Error details:", error);
    }
  }
};

/**
 * Log a debug message (only in development)
 * @param {string} message - The message to log
 * @param {Object} [data] - Optional data to include
 */
const debug = (message, data) => {
  if (isDevelopment) {
    console.log(`[DEBUG] ${message}`, data ? data : "");
  }
};

/**
 * Log the start of a request
 * @param {Object} req - Express request object
 */
const logRequest = (req) => {
  if (isDevelopment) {
    const { method, originalUrl, ip, body } = req;
    debug(
      `${method} ${originalUrl} - IP: ${ip}`,
      Object.keys(body || {}).length
        ? { body: sanitizeRequestBody(body) }
        : undefined
    );
  }
};

/**
 * Sanitize sensitive information from request body
 * @param {Object} body - Request body
 * @returns {Object} Sanitized body
 */
const sanitizeRequestBody = (body) => {
  if (!body || typeof body !== "object") return body;

  const sanitized = { ...body };

  // List of fields to sanitize
  const sensitiveFields = ["password", "token", "secret", "apiKey", "api_key"];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
};

module.exports = {
  info,
  warn,
  error,
  debug,
  logRequest
};
