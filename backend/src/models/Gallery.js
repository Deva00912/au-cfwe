const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [200, "Title cannot be more than 200 characters"],
  },
  description: {
    type: String,
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  image: {
    type: String,
    required: [true, "Please add an image"],
  },
  imagePublicId: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
  },
  year: {
    type: Number,
    required: [true, "Please add the year"],
    min: [1980, "Year must be after 1980"],
    max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gallery", GallerySchema);
