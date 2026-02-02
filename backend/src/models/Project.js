const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  abstract: {
    type: String,
    maxlength: [500, "Abstract cannot be more than 500 characters"],
  },
  image: {
    type: String,
    required: [true, "Please add a project image"],
  },
  imagePublicId: {
    type: String,
  },
  department: {
    type: String,
    required: [true, "Please add a department"],
  },
  year: {
    type: Number,
    required: [true, "Please add the year"],
    min: [2000, "Year must be after 2000"],
    max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
  },
  status: {
    type: String,
    enum: ["ongoing", "completed", "upcoming"],
    default: "ongoing",
  },
  supervisor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  teamMembers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  attachments: [AttachmentSchema],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Project", ProjectSchema);
