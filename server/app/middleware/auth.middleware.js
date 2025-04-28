const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Middleware to protect routes
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // First check Authorization header (Bearer token)
    if (req.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Fallback to cookie if header is not present
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token :", decoded);
    // Get user from token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found"
      });
    }

    // Set user on request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed"
    });
  }
};

/**
 * Socket.io JWT authentication middleware
 */
exports.socketAuth = (socket, next) => {
  // Try to get token from cookies first (available through handshake)
  let token = socket.handshake.headers.cookie
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("token="))
    ?.split("=")[1];

  // Fallback to auth object if cookie is not present
  if (!token && socket.handshake.auth && socket.handshake.auth.token) {
    token = socket.handshake.auth.token;
  }

  if (!token) {
    return next(new Error("Authentication error: Token required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.userId };

    // Fetch additional user data if needed
    prisma.user
      .findUnique({
        where: { id: decoded.userId },
        select: { displayName: true, email: true }
      })
      .then((user) => {
        if (user) {
          socket.user.displayName = user.displayName;
          socket.user.email = user.email;
        }
        next();
      })
      .catch((err) => {
        console.error("Socket auth user fetch error:", err);
        next();
      });
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
