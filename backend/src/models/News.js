const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  excerpt: {
    type: String,
    maxlength: 200,
  },
  image: {
    url: String,
    publicId: String,
  },
  category: {
    type: String,
    enum: ["news", "notification"],
    default: "news",
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
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

// Update excerpt from content if not provided
newsSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt =
      this.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...";
  }
  this.updatedAt = Date.now();
  next();
});

// Index for search
newsSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("News", newsSchema);
