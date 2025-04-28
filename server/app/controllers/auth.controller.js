const authService = require("../services/auth.service");
const logger = require("../utils/logger");

/**
 * User validation utilities
 */
const validateUser = (userData) => {
  const errors = {};
  const { email, password } = userData;

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Invalid email format";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6)
    errors.password = "Password must be at least 6 characters";

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * User registration
 */
exports.signup = async (req, res, next) => {
  try {
    // Validate user input
    const validationErrors = validateUser(req.body);
    if (validationErrors) {
      logger.debug("Signup validation failed", validationErrors);
      return res.badRequest("Validation failed", validationErrors);
    }

    // Call the service to handle registration
    const result = await authService.signup(req.body);

    // Set cookie and send response
    res.cookie("token", result.token, authService.getTokenCookieOptions());

    logger.info(`User registered: ${req.body.email}`);
    return res.created(
      {
        user: result.user,
        token: result.token
      },
      "User registered successfully"
    );
  } catch (error) {
    logger.error("Registration error", error);

    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.badRequest("User with this email already exists", {
        email: "User with this email already exists"
      });
    }

    return res.serverError("An error occurred during registration", error);
  }
};

/**
 * User login
 */
exports.login = async (req, res, next) => {
  try {
    // Basic validation
    const { email, password } = req.body;
    if (!email || !password) {
      logger.debug("Login validation failed", {
        email: !email,
        password: !password
      });
      return res.badRequest("Email and password are required", {
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined
      });
    }

    // Call the service to handle login
    const result = await authService.login(req.body);

    // Set cookie and send response
    res.cookie("token", result.token, authService.getTokenCookieOptions());

    logger.info(`User logged in: ${email}`);
    return res.ok(
      {
        user: result.user,
        token: result.token
      },
      "Login successful"
    );
  } catch (error) {
    logger.error("Login error", error);

    if (error.message === "Invalid credentials") {
      return res.unauthorized("Invalid credentials");
    }

    return res.serverError("An error occurred during login", error);
  }
};

/**
 * User logout
 */
exports.logout = (req, res) => {
  res.clearCookie("token");
  logger.info(`User logged out: ${req.user?.id || "Unknown"}`);
  return res.ok(null, "Logged out successfully");
};
