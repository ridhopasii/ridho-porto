/**
 * Lazy Loading Implementation
 */

class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      this.images.forEach((img) => this.observer.observe(img));
    } else {
      // Fallback for older browsers
      this.images.forEach((img) => this.loadImage(img));
    }
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.removeAttribute('data-src');
    img.classList.add('loaded');

    if (this.observer) {
      this.observer.unobserve(img);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LazyLoader());
} else {
  new LazyLoader();
}
