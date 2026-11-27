const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token and attach cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "gigcraft_jwt_development_secret_key_2026",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        title: user.title,
        isVerified: user.isVerified,
      },
    });
};

// @desc    Register a new user (Client or Freelancer ONLY)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Strict role restriction: Never allow 'admin' from public registration
    const safeRole = role === "freelancer" ? "freelancer" : "client";

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: safeRole,
      status: "active",
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ error: error.message || "Registration failed." });
  }
};

// @desc    Login user (Admin, Freelancer, Client)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Check account status
    if (user.status === "suspended" || user.status === "blocked") {
      return res.status(403).json({
        error: `Account is ${user.status}. Reason: ${user.suspensionReason || "Administrative decision"}`,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message || "Login failed." });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch user session." });
  }
};

// @desc    Log out user / clear cookie
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully." });
};
