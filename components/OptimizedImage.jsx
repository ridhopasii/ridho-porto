'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

/**
 * Optimized Image Component with loading state
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  objectFit = 'cover',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 border border-white/10 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <ImageIcon size={32} className="text-gray-600" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={fill ? {} : { width, height }}>
      {isLoading && <div className="absolute inset-0 bg-white/5 animate-pulse rounded-inherit" />}
      <Image
        src={src}
        alt={alt || 'Image'}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${fill ? `object-${objectFit}` : ''}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        placeholder={blurDataURL ? placeholder : 'empty'}
        blurDataURL={blurDataURL}
        {...props}
      />
    </div>
  );
}

/**
 * Avatar Image Component
 */
export function AvatarImage({ src, alt, size = 40, className = '' }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      objectFit="cover"
    />
  );
}

/**
 * Card Image Component
 */
export function CardImage({ src, alt, aspectRatio = '16/9', className = '' }) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <OptimizedImage src={src} alt={alt} fill objectFit="cover" />
    </div>
  );
}
