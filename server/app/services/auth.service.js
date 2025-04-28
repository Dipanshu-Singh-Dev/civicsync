const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

/**
 * Get cookie configuration for JWT
 */
const getTokenCookieOptions = () => {
  return {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: true, // Use HTTPS in production
    sameSite: "none", // Allow cross-site cookie usage
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/" // Cookie is valid for all routes
  };
};

/**
 * Generate JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

/**
 * User registration service
 */
const signup = async ({ email, password, displayName }) => {
  // Check if user exists
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await userRepository.createUser({
    email,
    password: passwordHash,
    displayName: displayName || email.split("@")[0] // Use part of email as display name if not provided
  });

  // Generate token
  const token = generateToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName
    },
    token
  };
};

/**
 * User login service
 */
const login = async ({ email, password }) => {
  // Find user by email
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName
    },
    token
  };
};

module.exports = {
  signup,
  login,
  getTokenCookieOptions
};
