const express = require("express");
const router = express.Router();
const multer = require("multer"); // Add this import
const newsController = require("../controllers/newsController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Public routes
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.get("/:id/related", newsController.getRelatedNews);

// Protected routes (Admin/Editor only)
router.post(
  "/",
  (req, res, next) => {
    console.log("[NEWS ROUTE] POST /api/news - Starting");
    next();
  },
  protect,
  (req, res, next) => {
    console.log("[NEWS ROUTE] Auth passed, user:", req.user?._id);
    next();
  },
  authorize("admin", "editor"),
  (req, res, next) => {
    console.log("[NEWS ROUTE] Authorization passed");
    next();
  },
  upload.single("image"),
  (req, res, next) => {
    console.log("[NEWS ROUTE] Upload complete, file:", req.file?.filename);
    next();
  },
  newsController.createNews
);

router.put(
  "/:id",
  protect,
  authorize("admin", "editor"),
  upload.single("image"),
  newsController.updateNews
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "editor"),
  newsController.deleteNews
);

// Error handling middleware for upload errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  next(err);
});

module.exports = router;
