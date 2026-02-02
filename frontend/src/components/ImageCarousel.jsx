import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import RenderImage from "./RenderImage";
import Button from "./Button";

export default function ImageCarousel(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === props?.carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? props?.carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative mb-8">
      <div
        className="overflow-hidden rounded-lg cursor-pointer"
        onClick={props?.handleImageClick || (() => {})}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {props?.carouselImages.map((image) => (
            <div key={image?.id} className="w-full flex-shrink-0">
              <div className="aspect-w-16 aspect-h-9">
                <RenderImage
                  src={image?.src}
                  alt={image?.alt}
                  className="w-full h-96 object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition-all shadow-lg"
        text={<ChevronLeft className="w-6 h-6" />}
      />

      <Button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition-all shadow-lg"
        text={<ChevronRight className="w-6 h-6" />}
      />

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {props?.carouselImages.map((_, index) => (
          <Button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
      {/* Thumbnail Grid - Add onClick handler to thumbnails too */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {props?.carouselImages.map((image, index) => (
          <Button
            key={image.id}
            onClick={() => goToSlide(index)}
            className={`rounded-lg overflow-hidden transition-all cursor-pointer ${
              index === currentIndex
                ? "ring-2 ring-[#FFC23C] ring-offset-2"
                : "opacity-70 hover:opacity-100"
            }`}
            text={
              <RenderImage
                src={image?.src}
                alt={image?.alt}
                className="w-full h-20 object-cover"
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
