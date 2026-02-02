const Project = require("../models/Project");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const fs = require("fs");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getAllProjects = async (req, res) => {
  try {
    const { status, department, year } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = department;
    }

    if (year) {
      query.year = parseInt(year);
    }

    const projects = await Project.find(query)
      .populate("teamMembers", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("teamMembers", "name email avatar department")
      .populate("supervisor", "name email department designation");

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Increment view count
    project.views += 1;
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid project ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin/Faculty
exports.createProject = async (req, res) => {
  try {
    console.log("Creating project with body:", req.body);
    console.log("Files received:", req.files ? Object.keys(req.files) : "none");

    let imageUrl = "";
    let imagePublicId = "";
    let attachments = [];

    // Upload main image if exists
    if (req.files?.image) {
      const uploadResult = await uploadToCloudinary(req.files.image[0].path);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
      fs.unlinkSync(req.files.image[0].path);
    }

    // Upload attachments if exist
    if (req.files?.attachments) {
      for (const file of req.files.attachments) {
        const uploadResult = await uploadToCloudinary(file.path);
        attachments.push({
          name: file.originalname,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          type: file.mimetype,
        });
        fs.unlinkSync(file.path);
      }
    }

    const projectData = {
      ...req.body,
      image: imageUrl,
      imagePublicId: imagePublicId,
      attachments: attachments,
      createdBy: req.user.id,
      teamMembers: req.body.teamMembers ? JSON.parse(req.body.teamMembers) : [],
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin/Faculty
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Check if user is authorized to update
    if (
      project.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this project",
      });
    }

    // Handle image update
    if (req.files?.image) {
      // Delete old image from Cloudinary if exists
      if (project.imagePublicId) {
        await deleteFromCloudinary(project.imagePublicId);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.files.image[0].path);
      req.body.image = uploadResult.secure_url;
      req.body.imagePublicId = uploadResult.public_id;
      fs.unlinkSync(req.files.image[0].path);
    }

    // Handle new attachments
    if (req.files?.attachments) {
      for (const file of req.files.attachments) {
        const uploadResult = await uploadToCloudinary(file.path);
        project.attachments.push({
          name: file.originalname,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          type: file.mimetype,
          uploadedAt: Date.now(),
        });
        fs.unlinkSync(file.path);
      }
    }

    // Parse JSON fields if they exist
    if (req.body.teamMembers) {
      req.body.teamMembers = JSON.parse(req.body.teamMembers);
    }
    if (req.body.tags) {
      req.body.tags = JSON.parse(req.body.tags);
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("teamMembers", "name email avatar");

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Check if user is authorized to delete
    if (
      project.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this project",
      });
    }

    // Delete main image from Cloudinary if exists
    if (project.imagePublicId) {
      await deleteFromCloudinary(project.imagePublicId);
    }

    // Delete all attachments from Cloudinary
    for (const attachment of project.attachments) {
      if (attachment.publicId) {
        await deleteFromCloudinary(attachment.publicId);
      }
    }

    await project.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid project ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Public
exports.getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
        },
      },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: "$count" },
          totalViews: { $sum: "$totalViews" },
          byStatus: { $push: { status: "$_id", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalProjects: 1,
          totalViews: 1,
          byStatus: 1,
        },
      },
    ]);

    // Get projects by year
    const projectsByYear = await Project.aggregate([
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Get projects by department
    const projectsByDepartment = await Project.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const statistics = {
      ...(stats[0] || {}),
      byYear: projectsByYear,
      byDepartment: projectsByDepartment,
    };

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("teamMembers", "name email avatar");

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Delete project attachment
// @route   DELETE /api/projects/:id/attachments/:attachmentId
// @access  Private/Admin/Faculty
exports.deleteProjectAttachment = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Check if user is authorized
    if (
      project.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete attachments",
      });
    }

    const attachment = project.attachments.id(req.params.attachmentId);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: "Attachment not found",
      });
    }

    // Delete from Cloudinary
    if (attachment.publicId) {
      await deleteFromCloudinary(attachment.publicId);
    }

    // Remove from array
    attachment.remove();
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
