const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Public routes
router.get("/", projectController.getAllProjects);
router.get("/featured", projectController.getFeaturedProjects);
router.get("/stats", projectController.getProjectStats);
router.get("/:id", projectController.getProject);

// Protected routes (Admin/Faculty)
router.post(
  "/",
  protect,
  authorize("admin", "faculty"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "attachments", maxCount: 10 },
  ]),
  projectController.createProject
);

router.put(
  "/:id",
  protect,
  authorize("admin", "faculty"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "attachments", maxCount: 10 },
  ]),
  projectController.updateProject
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  projectController.deleteProject
);

router.delete(
  "/:id/attachments/:attachmentId",
  protect,
  authorize("admin", "faculty"),
  projectController.deleteProjectAttachment
);

module.exports = router;
