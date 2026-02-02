const express = require("express");
const router = express.Router();
const multer = require("multer"); // Add this import
const programController = require("../controllers/programController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Public routes
router.get("/", programController.getAllPrograms);
router.get("/:id", programController.getProgramById);
router.get("/year/:year", programController.getProgramsByYear);
router.get("/stats/overview", programController.getProgramStats);

// Protected routes (Admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  programController.createProgram
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  programController.updateProgram
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  programController.deleteProgram
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
