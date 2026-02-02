import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import RenderImage from "../components/RenderImage";
import Button from "../components/Button";
import { GetImageUrl } from "../Utils/Utils";
import { galleryAPI } from "../services/api";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.getAll(1, 100);
      const images = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];

      const formattedImages = images.map((item) => ({
        ...item,
        id: item._id || item.id,
        src: item.image?.url || item.image || item.src,
        alt: item.title || item.alt || "Gallery Image",
        category: item.category || "Uncategorized",
      }));

      setGalleryImages(formattedImages);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo to calculate categories only when galleryImages changes
  const categories = useMemo(() => {
    const uniqueCategories = new Set(["All"]);

    galleryImages.forEach((img) => {
      if (img?.category && img.category.trim()) {
        uniqueCategories.add(img.category);
      }
    });

    return Array.from(uniqueCategories).sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    });
  }, [galleryImages]);

  const filteredImages = useMemo(() => {
    if (filter === "All") return galleryImages;
    return galleryImages.filter((img) => img?.category === filter);
  }, [galleryImages, filter]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;

    const currentIndex = filteredImages.findIndex(
      (img) => img?.id === selectedImage?.id,
    );

    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex =
        currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }

    setSelectedImage(filteredImages[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error && galleryImages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Error Loading Gallery
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchGallery}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our campus, events, and activities through our photo gallery
          </p>
        </div>

        {/* Stats and Filter */}
        <div className="mb-8">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {galleryImages.length}
                </div>
                <div className="text-sm text-gray-600">Total Images</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredImages.length}
                </div>
                <div className="text-sm text-gray-600">
                  {filter === "All" ? "All Categories" : filter}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(galleryImages.map((img) => img.category)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Categories</div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  filter === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                text={category}
              />
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No images found
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === "All"
                ? "No gallery images available"
                : `No images found in "${filter}" category`}
            </p>
            {filter !== "All" && (
              <button
                onClick={() => setFilter("All")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Images
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => openModal(image)}
                >
                  <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
                    <RenderImage
                      src={GetImageUrl(image.src)}
                      alt={image.alt}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {image.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {image.year && `• ${image.year}`}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium line-clamp-2">
                      {image.alt}
                    </p>
                    {image.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            <div className="mt-8 text-center text-gray-600">
              <p>
                Showing {filteredImages.length} image
                {filteredImages.length !== 1 ? "s" : ""}
                {filter !== "All" && ` in "${filter}" category`}
              </p>
            </div>
          </>
        )}

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full w-full">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Buttons */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
                      ←
                    </div>
                  </button>
                  <button
                    onClick={() => navigateImage("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
                  >
                    <div className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
                      →
                    </div>
                  </button>
                </>
              )}

              {/* Image Container */}
              <div className="relative w-full h-96 md:h-[80vh] flex items-center justify-center bg-gray-900 rounded-lg">
                <RenderImage
                  src={GetImageUrl(selectedImage.src)}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                />
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-6 rounded-b-lg">
                <div className="flex flex-wrap justify-between items-start mb-2">
                  <div>
                    <p className="text-sm opacity-75 mb-1">
                      {selectedImage.category}
                      {selectedImage.year && ` • ${selectedImage.year}`}
                    </p>
                    <p className="text-xl font-medium">{selectedImage.alt}</p>
                  </div>
                  <p className="text-sm opacity-75 mt-1">
                    {filteredImages.findIndex(
                      (img) => img.id === selectedImage.id,
                    ) + 1}{" "}
                    of {filteredImages.length}
                  </p>
                </div>
                {selectedImage.description && (
                  <p className="text-sm opacity-90 mt-3 border-t border-white/20 pt-3">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
