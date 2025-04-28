/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Handle specific error types
  if (err.type === "validation") {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  if (err.type === "authentication") {
    return res.status(401).json({
      success: false,
      message: err.message || "Authentication failed"
    });
  }

  if (err.type === "authorization") {
    return res.status(403).json({
      success: false,
      message: err.message || "Not authorized"
    });
  }

  if (err.type === "notFound") {
    return res.status(404).json({
      success: false,
      message: err.message || "Resource not found"
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}

module.exports = errorHandler;
