// test-imports.js
try {
  console.log("Testing imports...");

  const express = require("express");
  console.log("✅ express");

  const multer = require("multer");
  console.log("✅ multer");

  const mongoose = require("mongoose");
  console.log("✅ mongoose");

  const auth = require("./src/middleware/auth");
  console.log("✅ middleware/auth");

  const upload = require("./src/middleware/upload");
  console.log("✅ middleware/upload");

  console.log("\n✅ All imports successful!");
} catch (error) {
  console.error("❌ Import failed:", error.message);
  console.error("Full error:", error);
}
