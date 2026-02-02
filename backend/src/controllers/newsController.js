const News = require("../models/News");

// @desc    Get all news/notifications
// @route   GET /api/news
// @access  Public
exports.getAllNews = async (req, res) => {
  try {
    const { category, isImportant, search, page = 1, limit = 10 } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (isImportant) query.isImportant = isImportant === "true";

    if (search) {
      query.$text = { $search: search };
    }

    const news = await News.find(query)
      .populate("author", "name email")
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await News.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: news.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get single news item
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate(
      "author",
      "name email"
    );

    if (!news) {
      return res.status(404).json({
        status: "error",
        message: "News not found",
      });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.status(200).json({
      status: "success",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Create news/notification
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = async (req, res) => {
  try {
    console.log("=== Create News Request ===");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    // Validate required fields
    if (!req.body.title || !req.body.title.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Title is required and cannot be empty",
      });
    }

    if (!req.body.content || !req.body.content.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Content is required and cannot be empty",
      });
    }

    const newsData = {
      title: req.body.title.trim(),
      content: req.body.content,
      category:
        req.body.isNotification === "true" || req.body.isNotification === true
          ? "notification"
          : "news",
      author: req.user.id,
    };

    // Add image if file was uploaded
    if (req.file) {
      newsData.image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    console.log("Creating news with data:", newsData);
    const news = await News.create(newsData);

    console.log("News created successfully:", news._id);
    res.status(201).json({
      status: "success",
      data: news,
    });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to create news",
    });
  }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        status: "error",
        message: "News not found",
      });
    }

    // Check if user is author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this news",
      });
    }

    // Prepare update data
    const updateData = {
      title: req.body.title || news.title,
      content: req.body.content || news.content,
      category:
        req.body.isNotification !== undefined
          ? req.body.isNotification === "true" ||
            req.body.isNotification === true
            ? "notification"
            : "news"
          : news.category,
    };

    // Add image if file was uploaded
    if (req.file) {
      updateData.image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    news = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        status: "error",
        message: "News not found",
      });
    }

    // Check if user is author or admin
    if (news.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this news",
      });
    }

    await news.deleteOne();

    res.status(200).json({
      status: "success",
      message: "News deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get related news
// @route   GET /api/news/:id/related
// @access  Public
exports.getRelatedNews = async (req, res) => {
  try {
    const currentNews = await News.findById(req.params.id);

    if (!currentNews) {
      return res.status(404).json({
        status: "error",
        message: "News not found",
      });
    }

    const relatedNews = await News.find({
      _id: { $ne: currentNews._id },
      category: currentNews.category,
      isPublished: true,
    })
      .limit(3)
      .sort({ publishedAt: -1 })
      .select("title excerpt image publishedAt");

    res.status(200).json({
      status: "success",
      data: relatedNews,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
