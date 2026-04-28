'use client';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoSwiper({
  images = [],
  aspectRatio = 'aspect-video',
  rounded = 'rounded-3xl',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  if (safeImages.length === 0) return null;

  const next = (e) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = (e) => {
    e?.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`relative group overflow-hidden ${aspectRatio} ${rounded} bg-background select-none`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / safeImages.length)}%)`,
          width: `${safeImages.length * 100}%`,
        }}
      >
        {safeImages.map((url, idx) => (
          <div key={idx} className="h-full flex-shrink-0" style={{ width: `${100 / safeImages.length}%` }}>
            <img
              src={url}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Controls — only show for multiple images */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/50 backdrop-blur-md text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:scale-110 shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/50 backdrop-blur-md text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:scale-110 shadow-lg"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-5 h-1.5 bg-accent'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>


        </>
      )}
    </div>
  );
}
