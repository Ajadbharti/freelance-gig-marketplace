const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware: validates token from HTTP-only cookie or Authorization header
const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Access denied. Authentication token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "gigcraft_jwt_development_secret_key_2026");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User session expired or user no longer exists." });
    }

    if (user.status === "suspended" || user.status === "blocked") {
      return res.status(403).json({
        error: `Account is ${user.status}. Reason: ${user.suspensionReason || "Administrative decision"}`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
};

// Admin only middleware: checks user role and single Super Admin authorization
const adminOnly = (req, res, next) => {
  const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

  if (
    !req.user ||
    req.user.role !== "admin" ||
    req.user.email.toLowerCase() !== SUPER_ADMIN_EMAIL
  ) {
    return res.status(403).json({
      error: "Access denied. Platform Administrator permissions restricted to designated Super Admin.",
    });
  }
  next();
};

module.exports = { protect, adminOnly };
