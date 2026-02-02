const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: 2000,
    max: new Date().getFullYear() + 5,
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, "Duration is required"],
  },
  participants: {
    type: Number,
    default: 0,
    min: 0,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  image: {
    url: String,
    publicId: String,
  },
  highlights: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
    enum: ["active", "completed", "upcoming"],
    default: "active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp
programSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for year and department
programSchema.index({ year: -1, department: 1 });

module.exports = mongoose.model("Program", programSchema);
