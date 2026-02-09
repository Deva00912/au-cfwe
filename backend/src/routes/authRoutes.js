const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", protect, authController.getMe);
router.put("/update-profile", protect, authController.updateProfile);

// Admin routes
router.post(
  "/admin/create-staff",
  protect,
  authorize("admin"),
  authController.createStaff,
);

module.exports = router;
