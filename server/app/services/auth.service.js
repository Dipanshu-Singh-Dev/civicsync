const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Cookie configuration for JWT
const getTokenCookieOptions = () => {
  return {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: true, // Use HTTPS in production
    sameSite: "none", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/" // Cookie is valid for all routes
  };
};

/**
 * User registration
 */
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: passwordHash
      }
    });

    // Generate token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, getTokenCookieOptions());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email
        }
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * User login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, getTokenCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * User logout
 */
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};
