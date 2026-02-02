import { useState, useRef, useEffect } from "react";
import { Upload, X, Trash2, Image as ImageIcon } from "lucide-react";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import RenderImage from "../components/RenderImage";
import { useToast } from "../context/ToastContext";
import { galleryAPI } from "../services/api";

const GalleryAdmin = () => {
  const { success, error: showError } = useToast();
  const [images, setImages] = useState([]);
  const [allGalleryImages, setAllGalleryImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImage, setNewImage] = useState({
    category: "",
    title: "",
    year: new Date().getFullYear(),
    description: "",
  });
  const fileInputRef = useRef(null);

  // Fetch gallery images on component mount
  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getAll(1, 100);
      const galleryData = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      setAllGalleryImages(galleryData);
    } catch (err) {
      showError("Failed to load gallery images");
      setAllGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      category: newImage.category.trim() || "General",
      title: newImage.title.trim() || file.name.split(".")[0],
      year: newImage.year,
      description: newImage.description.trim(),
      status: "pending",
    }));

    setImages((prev) => [...prev, ...newImages]);
    event.target.value = "";
  };

  const validateImages = () => {
    const errors = [];

    if (images.length === 0) {
      errors.push("Please select images to upload");
    }

    images.forEach((image, index) => {
      if (!image.title?.trim()) {
        errors.push(`Image ${index + 1}: Title is required`);
      }
      if (!image.category?.trim()) {
        errors.push(`Image ${index + 1}: Category is required`);
      }
      if (
        !image.year ||
        image.year < 2000 ||
        image.year > new Date().getFullYear() + 1
      ) {
        errors.push(`Image ${index + 1}: Please enter a valid year`);
      }
    });

    return errors;
  };

  const handleUpload = async () => {
    const validationErrors = validateImages();
    if (validationErrors.length > 0) {
      showError(validationErrors[0]);
      return;
    }

    setUploading(true);
    const pendingImages = images.filter((img) => img.status === "pending");
    let successCount = 0;
    let errorCount = 0;

    for (let image of pendingImages) {
      try {
        const formData = new FormData();
        formData.append("image", image.file);
        formData.append("category", image.category.trim());
        formData.append("title", image.title.trim());
        formData.append("year", image.year.toString());
        if (image.description?.trim()) {
          formData.append("description", image.description.trim());
        }

        await galleryAPI.create(formData);

        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "uploaded" } : img,
          ),
        );
        successCount++;
      } catch (error) {
        console.error("Error uploading image:", error);
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "error" } : img,
          ),
        );
        errorCount++;
      }
    }

    // Refresh gallery list if any images were uploaded successfully
    if (successCount > 0) {
      await fetchGalleryImages();
      success(`${successCount} image(s) uploaded successfully!`);
    }
    if (errorCount > 0) {
      showError(`${errorCount} image(s) failed to upload`);
    }

    setUploading(false);
  };

  const deleteImage = async (id) => {
    if (!id) {
      showError("Cannot delete: Image ID is missing");
      return;
    }

    try {
      await galleryAPI.delete(id);
      setAllGalleryImages((prev) => prev.filter((img) => img._id !== id));
      success("Image deleted successfully!");
    } catch (err) {
      console.error("Error deleting image:", err);
      showError("Failed to delete image");
    }
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateImageInfo = (id, field, value) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              [field]: field === "year" ? parseInt(value) || "" : value,
            }
          : img,
      ),
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "uploaded":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "uploaded":
        return "Uploaded";
      case "error":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || "" : value,
    }));
  };

  const clearAllImages = () => {
    // Revoke object URLs to prevent memory leaks
    images.forEach((img) => {
      if (img.preview && img.preview.startsWith("blob:")) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
  };

  const pendingUploads = images.filter(
    (img) => img.status === "pending",
  ).length;
  const uploadedCount = images.filter(
    (img) => img.status === "uploaded",
  ).length;
  const errorCount = images.filter((img) => img.status === "error").length;

  if (loading && allGalleryImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC23C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gallery Management
          </h1>
          <p className="text-gray-600">Upload and manage gallery images</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload New Images
              </h2>

              {/* Category Input - CHANGED TO INPUT BOX */}
              <div className="mb-4">
                <InputBox
                  id="category"
                  name="category"
                  labelTitle="Category *"
                  labelClassName="block text-sm font-medium text-gray-700 mb-2"
                  type="text"
                  value={newImage.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Campus, Events, Sports, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <InputBox
                  id="title"
                  name="title"
                  labelTitle="Title *"
                  labelClassName="block text-sm font-medium text-gray-700 mb-2"
                  type="text"
                  value={newImage.title}
                  onChange={handleInputChange}
                  placeholder="Enter image title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                />
              </div>

              {/* Year Input */}
              <div className="mb-4">
                <InputBox
                  id="year"
                  name="year"
                  labelTitle="Year *"
                  labelClassName="block text-sm font-medium text-gray-700 mb-2"
                  type="number"
                  value={newImage.year}
                  onChange={handleInputChange}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <InputBox
                  id="description"
                  name="description"
                  labelTitle="Description (Optional)"
                  labelClassName="block text-sm font-medium text-gray-700 mb-2"
                  type="text"
                  value={newImage.description}
                  onChange={handleInputChange}
                  placeholder="Enter image description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                />
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#FFC23C] transition-colors mb-4 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Click to upload images</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || pendingUploads === 0}
                  className="w-full bg-[#FFC23C] text-gray-800 py-3 rounded-lg font-semibold hover:bg-[#E6AE35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {pendingUploads > 0 ? `(${pendingUploads})` : ""}
                    </>
                  )}
                </Button>

                {images.length > 0 && (
                  <Button
                    onClick={clearAllImages}
                    disabled={uploading}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {images.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {uploadedCount}
                  </div>
                  <div className="text-sm text-gray-600">Uploaded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {pendingUploads}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {errorCount}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </div>

            {/* Images List */}
            {images.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No images uploaded yet
                </h3>
                <p className="text-gray-600">
                  Start by uploading some images using the panel on the left.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative aspect-w-16 aspect-h-9">
                      <RenderImage
                        src={image.preview || image.src}
                        alt={image.title}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />

                      {/* Status Badge */}
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          image.status,
                        )}`}
                      >
                        {getStatusText(image.status)}
                      </div>

                      {/* Delete Button */}
                      <Button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Image Info */}
                    <div className="p-4">
                      {/* Title Input */}
                      <div className="mb-3">
                        <InputBox
                          labelTitle="Title *"
                          labelClassName="block text-sm font-medium text-gray-700 mb-1"
                          type="text"
                          value={image.title}
                          onChange={(e) =>
                            updateImageInfo(image.id, "title", e.target.value)
                          }
                          placeholder="Enter title"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FFC23C] transition-colors"
                          disabled={image.status === "uploaded"}
                        />
                      </div>

                      {/* Category Input - CHANGED TO INPUT BOX */}
                      <div className="mb-3">
                        <InputBox
                          labelTitle="Category *"
                          labelClassName="block text-sm font-medium text-gray-700 mb-1"
                          type="text"
                          value={image.category}
                          onChange={(e) =>
                            updateImageInfo(
                              image.id,
                              "category",
                              e.target.value,
                            )
                          }
                          placeholder="Enter category"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FFC23C] transition-colors"
                          disabled={image.status === "uploaded"}
                        />
                      </div>

                      {/* Year Input */}
                      <div className="mb-3">
                        <InputBox
                          labelTitle="Year *"
                          labelClassName="block text-sm font-medium text-gray-700 mb-1"
                          type="number"
                          value={image.year}
                          onChange={(e) =>
                            updateImageInfo(image.id, "year", e.target.value)
                          }
                          min="2000"
                          max={new Date().getFullYear() + 1}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FFC23C] transition-colors"
                          disabled={image.status === "uploaded"}
                        />
                      </div>

                      {/* Description Input */}
                      <div>
                        <InputBox
                          labelTitle="Description"
                          labelClassName="block text-sm font-medium text-gray-700 mb-1"
                          type="text"
                          value={image.description || ""}
                          onChange={(e) =>
                            updateImageInfo(
                              image.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Enter description"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FFC23C] transition-colors"
                          disabled={image.status === "uploaded"}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Already Uploaded Gallery Images */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Gallery Images ({allGalleryImages.length})
            </h2>
            {allGalleryImages.length > 0 && (
              <Button
                onClick={fetchGalleryImages}
                disabled={uploading || loading}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Refresh
              </Button>
            )}
          </div>

          {allGalleryImages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No gallery images
              </h3>
              <p className="text-gray-600">Upload images to see them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allGalleryImages.map((image) => (
                <div
                  key={image._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
                    <RenderImage
                      src={image.image?.url || image.image || ""}
                      alt={image.title}
                      className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => setSelectedImage(image)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded line-clamp-1">
                        {image.category || "Uncategorized"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {image.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {image.title}
                    </h3>

                    {image.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {image.description}
                      </p>
                    )}

                    {/* Delete Button */}
                    <Button
                      onClick={() => deleteImage(image._id)}
                      className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </Button>
            <RenderImage
              src={
                selectedImage.preview ||
                selectedImage.image?.url ||
                selectedImage.image ||
                ""
              }
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm opacity-75">
                    {selectedImage.category || "Uncategorized"}
                  </p>
                  <p className="text-lg font-medium">{selectedImage.title}</p>
                </div>
                <p className="text-sm opacity-75">{selectedImage.year}</p>
              </div>
              {selectedImage.description && (
                <p className="text-sm opacity-90">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
