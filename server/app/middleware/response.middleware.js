/**
 * Standardized response format middleware
 * This adds response helper methods to the response object.
 */

const responseMiddleware = (req, res, next) => {
  // Success response helper with status code 200
  res.ok = (data = null, message = "Success") => {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  };

  // Created response helper with status code 201
  res.created = (data = null, message = "Resource created successfully") => {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  };

  // Bad request response helper with status code 400
  res.badRequest = (message = "Bad request", errors = null) => {
    return res.status(400).json({
      success: false,
      message,
      errors
    });
  };

  // Unauthorized response helper with status code 401
  res.unauthorized = (message = "Unauthorized") => {
    return res.status(401).json({
      success: false,
      message
    });
  };

  // Forbidden response helper with status code 403
  res.forbidden = (message = "Forbidden") => {
    return res.status(403).json({
      success: false,
      message
    });
  };

  // Not found response helper with status code 404
  res.notFound = (message = "Resource not found") => {
    return res.status(404).json({
      success: false,
      message
    });
  };

  // Server error response helper with status code 500
  res.serverError = (message = "Server error", error = null) => {
    const errorDetails =
      process.env.NODE_ENV === "development" && error
        ? { error: error.message || String(error) }
        : undefined;

    return res.status(500).json({
      success: false,
      message,
      ...errorDetails
    });
  };

  next();
};

module.exports = responseMiddleware;
