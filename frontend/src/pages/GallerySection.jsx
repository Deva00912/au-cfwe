import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import ImageCarousel from "../components/ImageCarousel";

// Sample images for carousel - use the same as gallery or different ones
const carouselImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500",
    alt: "Campus Building",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500",
    alt: "Students in classroom",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500",
    alt: "Graduation ceremony",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1551833996-2c5c12eed91a?w=500",
    alt: "Library",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1562774053-701939374585?w=500",
    alt: "Sports event",
  },
];

const GallerySection = () => {
  const navigate = useNavigate(); // Add this hook

  // Function to handle image click - navigate to gallery page
  const handleImageClick = () => {
    navigate("/gallery");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a visual journey through our Centre of Empowerment of Women
            life, events, and facilities.
          </p>
        </div>

        {/* Carousel - Add onClick handler to the main carousel image */}
        <ImageCarousel
          carouselImages={carouselImages}
          handleImageClick={handleImageClick}
        />
      </div>
    </section>
  );
};

export default GallerySection;
