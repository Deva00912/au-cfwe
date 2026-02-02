const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      console.log("[AUTH] No token provided");
      return res.status(401).json({
        status: "error",
        message: "Not authorized to access this route",
      });
    }

    console.log("[AUTH] Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("[AUTH] User not found with ID:", decoded.id);
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!user.isActive) {
      console.log("[AUTH] User account is deactivated:", user._id);
      return res.status(401).json({
        status: "error",
        message: "User account is deactivated",
      });
    }

    console.log("[AUTH] User authenticated:", user._id, "Role:", user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error("[AUTH] Error:", error.message);
    return res.status(401).json({
      status: "error",
      message: "Not authorized to access this route",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
