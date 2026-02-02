const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");

// Load environment variables
dotenv.config();

// Import routes - FIXED PATH
const routes = require("./src/routes/index"); // Add /index

const app = express();

// Create uploads directories
const fs = require("fs");
const uploadsDir = process.env.UPLOAD_PATH || path.join(__dirname, "uploads");
const projectsDir = path.join(uploadsDir, "projects");

[uploadsDir, projectsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Created directory:", dir);
  }
});

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:",
          process.env.FRONTEND_URL,
        ],
        mediaSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL],
        fontSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    allowedOrigins.push(process.env.FRONTEND_URL);

    const uniqueOrigins = [...new Set(allowedOrigins.filter(Boolean))];

    if (uniqueOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn("CORS blocked:", origin, "is not in allowed origins");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
app.use(express.json({ limit: maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: maxFileSize }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Static file serving
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/", routes);

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log("MongoDB Atlas connected successfully");
    console.log("Database:", conn.connection.name);
    console.log("Host:", conn.connection.host);

    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    if (error.name === "MongoServerSelectionError") {
      console.error("Please check:");
      console.error("1. Your MongoDB Atlas connection string");
      console.error("2. Your IP is whitelisted in MongoDB Atlas");
      console.error("3. Your database user has correct permissions");
      console.error("4. Your internet connection");
    }

    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
    throw error;
  }
};

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  if (err instanceof multer.MulterError) {
    let message = "File upload error";
    let statusCode = 400;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = `File too large. Maximum size is ${Math.round(
          maxFileSize / (1024 * 1024)
        )}MB.`;
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field in upload.";
        break;
    }

    return res.status(statusCode).json({
      status: "error",
      message,
    });
  }

  if (err.message && err.message.includes("Only")) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong! Please try again later."
        : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 7000;
    const HOST = process.env.HOST || "localhost";

    const server = app.listen(PORT, HOST, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode`
      );
      console.log(`Server URL: http://${HOST}:${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log("Available endpoints:");
      console.log("  Auth:       http://" + HOST + ":" + PORT + "/api/auth");
      console.log("  News:       http://" + HOST + ":" + PORT + "/api/news");
      console.log(
        "  Programs:   http://" + HOST + ":" + PORT + "/api/programs"
      );
      console.log("  Health:     http://" + HOST + ":" + PORT + "/health");
      console.log("  Uploads:    http://" + HOST + ":" + PORT + "/uploads/");
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log("Received shutdown signal. Closing connections...");
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Promise Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
