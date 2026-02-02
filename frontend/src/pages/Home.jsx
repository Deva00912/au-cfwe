import {
  ArrowRight,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import Facilities from "../components/Facilities";
import NewsSection from "../components/NewsSection";
import { FormatExcerpt } from "../Utils/Utils";
import { programAPI, galleryAPI } from "../services/api";

const Home = () => {
  const [programs, setPrograms] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programsError, setProgramsError] = useState(null);
  const [galleryError, setGalleryError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPrograms(), fetchGalleryImages()]);
    setLoading(false);
  };

  const fetchPrograms = async () => {
    setProgramsError(null);
    try {
      const response = await programAPI.getAll();
      const programsData = Array.isArray(
        response.data?.data?.programs ||
          response.data?.programs ||
          response.data,
      )
        ? response.data?.data?.programs ||
          response.data?.programs ||
          response.data
        : [];
      setPrograms(programsData);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setProgramsError("Failed to load programs");
      setPrograms([]);
    }
  };

  const fetchGalleryImages = async () => {
    setGalleryError(null);
    try {
      const response = await galleryAPI.getAll(1, 10);
      const galleryData = Array.isArray(response.data?.data || response.data)
        ? response.data?.data || response.data
        : [];
      setGalleryImages(galleryData);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      setGalleryError("Failed to load gallery images");
      setGalleryImages([]);
    }
  };

  // Auto-rotate carousel
  useEffect(() => {
    if (galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryImages.length, currentImageIndex]);

  const nextImage = useCallback(() => {
    if (galleryImages.length <= 1) return;

    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1,
    );

    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 300);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    if (galleryImages.length <= 1) return;

    setIsTransitioning(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1,
    );

    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 300);
  }, [galleryImages.length]);

  // Get latest programs using useMemo for performance
  const latestPrograms = useMemo(() => {
    if (!Array.isArray(programs) || programs.length === 0) return [];

    // Sort by year and date, then take first 3
    return [...programs]
      .sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return new Date(b.date || 0) - new Date(a.date || 0);
      })
      .slice(0, 3);
  }, [programs]);

  // Loading state
  if (loading && programs.length === 0 && galleryImages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const currentImage = galleryImages[currentImageIndex];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 shadow-2xl border border-white/20">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Welcome to Centre for Empowerment of Women
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-white/90 text-justify">
              Empowering women builds stronger communities. Our Centre serves as
              a catalyst for this transformation by uniting diverse
              stakeholders—from technologists to decision-makers—to create
              powerful opportunities for women. We foster innovation, impart
              crucial entrepreneurial skills, and illuminate the path to
              financial literacy and market access. By providing both the
              knowledge and the means, we empower self-help groups to not just
              participate in the economy, but to lead and thrive within it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/programs"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-center"
              >
                Explore Programs
              </Link>
              <Link
                to="/facilities"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors text-center"
              >
                Explore Facilities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Gallery Highlights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A glimpse into our activities and events
              </p>
            </div>

            {/* Single Image Carousel */}
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                {/* Image Container */}
                <div className="relative h-96 md:h-[500px]">
                  {currentImage && (
                    <img
                      src={currentImage.image?.url || currentImage.image || ""}
                      alt={currentImage.title || "Gallery Image"}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${
                        isTransitioning ? "opacity-70" : "opacity-100"
                      }`}
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Navigation Arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        disabled={isTransitioning}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-50 transition-all duration-200 z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        disabled={isTransitioning}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 disabled:opacity-50 transition-all duration-200 z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Info */}
                  {currentImage && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          {currentImage.category && (
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                              {currentImage.category}
                            </span>
                          )}
                          {currentImage.year && (
                            <span className="text-sm opacity-90">
                              • {currentImage.year}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">
                          {currentImage.title}
                        </h3>
                        {currentImage.description && (
                          <p className="text-lg opacity-90 line-clamp-2">
                            {currentImage.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/30">
                    <div
                      className="h-full bg-white transition-all duration-5000 ease-linear"
                      style={{
                        width: "100%",
                        animation:
                          galleryImages.length > 1
                            ? "progress 5s linear infinite"
                            : "none",
                      }}
                    />
                  </div>
                )}

                {/* View Gallery Button */}
                <Link
                  to="/gallery"
                  className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center z-20"
                >
                  View Gallery
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Dots Indicator */}
              {galleryImages.length > 1 && (
                <div className="flex justify-center mt-8 space-x-3">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsTransitioning(true);
                        setCurrentImageIndex(index);
                        setTimeout(() => setIsTransitioning(false), 300);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-blue-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {galleryImages.length > 1 && (
                <div className="text-center mt-4 text-gray-600">
                  <span className="font-medium">{currentImageIndex + 1}</span>
                  <span className="mx-2">of</span>
                  <span className="font-medium">{galleryImages.length}</span>
                </div>
              )}
            </div>

            {galleryError && (
              <div className="text-center mt-4 text-red-600 text-sm">
                {galleryError}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Programs Section */}
      {latestPrograms.length > 0 ? (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Featured Programs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-justify">
                Discover our core programs in tech training, entrepreneurship,
                and financial access—designed to equip you with skills for
                success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {latestPrograms.map((program) => (
                <Link
                  key={program._id || program.id}
                  to={`/programs/${program._id || program.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block group border border-gray-100"
                >
                  {/* Program Image */}
                  <div className="relative h-48 overflow-hidden">
                    {program.image ? (
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <div className="text-blue-800 text-2xl">📚</div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded line-clamp-1">
                        {program.department || "General"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {program.year || new Date().getFullYear()}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {program.title || "Program"}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {FormatExcerpt(program.description) ||
                        "No description available"}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {program.duration || "Duration not specified"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{program.participants || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-blue-600 group-hover:text-blue-800 font-medium text-sm">
                      View Program Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/programs"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Programs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        programsError && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No Programs Available
              </h3>
              <p className="text-gray-600 mb-4">
                Check back later for upcoming programs
              </p>
            </div>
          </div>
        )
      )}

      <NewsSection />
      <Facilities />
    </div>
  );
};

// Add CSS for the progress bar animation
const styles = `
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
`;

// Add styles to document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Home;
