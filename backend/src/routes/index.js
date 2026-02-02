const express = require("express");
const router = express.Router();
const errorHandler = require("../middleware/errorHandler");

// Import all route files
const authRoutes = require("./authRoutes");
const newsRoutes = require("./newsRoutes");
const programRoutes = require("./programRoutes");
const galleryRoutes = require("./galleryRoutes");
const projectRoutes = require("./projectRoutes");

// API Documentation route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the University Management System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      news: "/api/news",
      programs: "/api/programs",
      gallery: "/api/gallery",
      projects: "/api/projects",
    },
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes with base paths
router.use("/api/auth", authRoutes);
router.use("/api/news", newsRoutes);
router.use("/api/programs", programRoutes);
router.use("/api/gallery", galleryRoutes);
router.use("/api/projects", projectRoutes);

// 404 handler for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
router.use(errorHandler);

module.exports = router;
