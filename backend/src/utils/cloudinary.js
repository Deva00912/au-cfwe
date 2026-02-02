const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the local file
 * @param {string} folder - Cloudinary folder name (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = "university") => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const options = {
      folder: folder,
      resource_type: "auto", // Automatically detect image, video, raw
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    // Upload file
    const result = await cloudinary.uploader.upload(filePath, options);

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Cloudinary delete result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array<Object>>} Array of upload results
 */
const uploadMultipleToCloudinary = async (filePaths, folder = "university") => {
  try {
    const uploadPromises = filePaths.map((filePath) =>
      uploadToCloudinary(filePath, folder)
    );

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error);
    throw error;
  }
};

/**
 * Get Cloudinary resource info
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Resource information
 */
const getResourceInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary get resource error:", error);
    throw error;
  }
};

/**
 * Generate image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Transformed image URL
 */
const generateImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return cloudinary.url(publicId, {
    ...mergedOptions,
    secure: true,
  });
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs
 * @returns {Promise<Object>} Delete results
 */
const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error("Array of public IDs is required");
    }

    const deletePromises = publicIds.map((publicId) =>
      deleteFromCloudinary(publicId)
    );

    const results = await Promise.allSettled(deletePromises);

    // Check for failures
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      console.error("Some files failed to delete:", failures);
    }

    return {
      success: failures.length === 0,
      total: publicIds.length,
      successful: publicIds.length - failures.length,
      failed: failures.length,
      failures: failures.map((f) => f.reason),
    };
  } catch (error) {
    console.error("Cloudinary multiple delete error:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  getResourceInfo,
  generateImageUrl,
  deleteMultipleFromCloudinary,
};
