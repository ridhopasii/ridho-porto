'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectCarousel({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0)
    return (
      <div className="w-full h-full bg-teal-500/10 flex items-center justify-center">
        <span className="text-teal-500/20 font-bold">NO IMAGE</span>
      </div>
    );

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${title} - ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md text-foreground rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-teal-500 hover:text-black z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-md text-foreground rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-teal-500 hover:text-black z-10"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentIndex === index ? 'bg-teal-500 w-4' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
