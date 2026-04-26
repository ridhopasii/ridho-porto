/**
 * Image Optimization Utilities
 */

/**
 * Generate blur data URL untuk placeholder
 */
export function generateBlurDataURL(width = 10, height = 10) {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return null;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(20, 20, 20, 0.8)');
  gradient.addColorStop(1, 'rgba(10, 10, 10, 0.9)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Get optimized image URL dari Supabase
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url) return null;

  const { width, height, quality = 85, format = 'webp' } = options;

  // Jika bukan Supabase URL, return as is
  if (!url.includes('supabase.co')) {
    return url;
  }

  // Supabase Storage transformation
  const urlObj = new URL(url);
  const params = new URLSearchParams();

  if (width) params.set('width', width);
  if (height) params.set('height', height);
  params.set('quality', quality);
  params.set('format', format);

  // Note: Supabase belum support image transformation by default
  // Ini placeholder untuk future implementation
  return url;
}

/**
 * Preload critical images
 */
export function preloadImage(src) {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Lazy load images dengan Intersection Observer
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;

        if (src) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Compress image before upload
 */
export async function compressImage(file, maxWidth = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Resize jika lebih besar dari maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
            );
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
