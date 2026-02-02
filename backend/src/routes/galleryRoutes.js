const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/galleryController");
const { protect, authorize } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");

// Public routes
router.get("/", galleryController.getAllGalleryItems);
router.get("/categories", galleryController.getGalleryCategories);
router.get("/years/:year", galleryController.getGalleryByYear);
router.get("/:id", galleryController.getGalleryItem);

// Protected routes (Admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  imageUpload.single("image"),
  galleryController.createGalleryItem
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  imageUpload.single("image"),
  galleryController.updateGalleryItem
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  galleryController.deleteGalleryItem
);

module.exports = router;
