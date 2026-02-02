const Program = require("../models/Program");

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
exports.getAllPrograms = async (req, res) => {
  try {
    const {
      year,
      department,
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (year) query.year = parseInt(year);
    if (department) query.department = department;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const programs = await Program.find(query)
      .populate("createdBy", "name email")
      .sort({ year: -1, date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Program.countDocuments(query);

    // Group programs by year
    const programsByYear = {};
    programs.forEach((program) => {
      if (!programsByYear[program.year]) {
        programsByYear[program.year] = [];
      }
      programsByYear[program.year].push(program);
    });

    res.status(200).json({
      status: "success",
      results: programs.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: {
        programs,
        programsByYear,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!program) {
      return res.status(404).json({
        status: "error",
        message: "Program not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Create program
// @route   POST /api/programs
// @access  Private/Admin
exports.createProgram = async (req, res) => {
  try {
    const programData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // Handle image upload
    if (req.file) {
      programData.image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    const program = await Program.create(programData);

    res.status(201).json({
      status: "success",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private/Admin
exports.updateProgram = async (req, res) => {
  try {
    let program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        status: "error",
        message: "Program not found",
      });
    }

    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      updateData.image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    program = await Program.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        status: "error",
        message: "Program not found",
      });
    }

    await program.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Program deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get programs by year
// @route   GET /api/programs/year/:year
// @access  Public
exports.getProgramsByYear = async (req, res) => {
  try {
    const programs = await Program.find({
      year: parseInt(req.params.year),
    })
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      status: "success",
      results: programs.length,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get program statistics
// @route   GET /api/programs/stats/overview
// @access  Public
exports.getProgramStats = async (req, res) => {
  try {
    const stats = await Program.aggregate([
      {
        $group: {
          _id: null,
          totalPrograms: { $sum: 1 },
          totalParticipants: { $sum: "$participants" },
          completedPrograms: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          ongoingPrograms: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          upcomingPrograms: {
            $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
          },
        },
      },
    ]);

    const yearlyStats = await Program.aggregate([
      {
        $group: {
          _id: "$year",
          programs: { $sum: 1 },
          participants: { $sum: "$participants" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 5 },
    ]);

    const departmentStats = await Program.aggregate([
      {
        $group: {
          _id: "$department",
          programs: { $sum: 1 },
        },
      },
      { $sort: { programs: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        overview: stats[0] || {
          totalPrograms: 0,
          totalParticipants: 0,
          completedPrograms: 0,
          ongoingPrograms: 0,
          upcomingPrograms: 0,
        },
        yearlyStats,
        departmentStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
