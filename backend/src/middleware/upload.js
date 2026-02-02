const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes =
    /jpeg|jpg|png|gif|webp|pdf|doc|docx|ppt|pptx|xls|xlsx|txt/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(
    file.mimetype.split("/")[1] || file.mimetype
  );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error(`Only the following file types are allowed: ${allowedTypes}`));
  }
};

// Initialize upload with 10MB limit
const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
    files: 10,
  },
  fileFilter: fileFilter,
});

// Create specific upload configurations
const imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype.split("/")[1]);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
  },
});

const multipleUpload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
    files: 10,
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload, // General upload
  imageUpload, // For single image uploads only
  multipleUpload, // For multiple file uploads
  // Middleware wrapper to log uploads
  uploadLogger: (req, res, next) => {
    console.log("[UPLOAD] Request:", {
      method: req.method,
      path: req.path,
      contentType: req.headers["content-type"],
      contentLength: req.headers["content-length"],
    });
    next();
  },
};
