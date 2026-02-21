/**
 * Loading States Manager
 */

class LoadingManager {
  constructor() {
    this.createLoadingOverlay();
  }

  createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden items-center justify-center';
    overlay.innerHTML = `
      <div class="bg-secondary p-8 rounded-2xl border border-white/10">
        <div class="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
        <p class="text-white mt-4 text-center">Loading...</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  show(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      const text = overlay.querySelector('p');
      if (text) text.textContent = message;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }
  }

  hide() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }
  }

  showSkeleton(container) {
    container.innerHTML = `
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-white/10 rounded w-3/4"></div>
        <div class="h-4 bg-white/10 rounded w-1/2"></div>
        <div class="h-4 bg-white/10 rounded w-5/6"></div>
      </div>
    `;
  }
}

window.loadingManager = new LoadingManager();
