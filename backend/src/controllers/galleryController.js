const Gallery = require("../models/Gallery");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const fs = require("fs");

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getAllGalleryItems = async (req, res) => {
  try {
    const { category, year } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (year) {
      query.year = parseInt(year);
    }

    const galleryItems = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        error: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid gallery item ID",
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
exports.createGalleryItem = async (req, res) => {
  try {
    let imageUrl = "";
    let imagePublicId = "";

    // Upload image if exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;

      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    }

    const galleryItem = await Gallery.create({
      ...req.body,
      image: imageUrl,
      imagePublicId: imagePublicId,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
exports.updateGalleryItem = async (req, res) => {
  try {
    let galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        error: "Gallery item not found",
      });
    }

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (galleryItem.imagePublicId) {
        await deleteFromCloudinary(galleryItem.imagePublicId);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.path);
      req.body.image = uploadResult.secure_url;
      req.body.imagePublicId = uploadResult.public_id;

      // Delete local file
      fs.unlinkSync(req.file.path);
    }

    galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        error: "Gallery item not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (galleryItem.imagePublicId) {
      await deleteFromCloudinary(galleryItem.imagePublicId);
    }

    // Use findByIdAndDelete instead of remove()
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid gallery item ID",
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc    Get gallery categories
// @route   GET /api/gallery/categories
// @access  Public
exports.getGalleryCategories = async (req, res) => {
  try {
    const categories = await Gallery.distinct("category");

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get gallery items by year
// @route   GET /api/gallery/years/:year
// @access  Public
exports.getGalleryByYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const galleryItems = await Gallery.find({ year }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
