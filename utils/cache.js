/**
 * Cache Management Utility
 * Implements caching strategy untuk mengurangi database queries
 */

const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 menit
  MEDIUM: 15 * 60 * 1000, // 15 menit
  LONG: 60 * 60 * 1000, // 1 jam
};

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Generate cache key dari table dan filters
   */
  generateKey(table, filters = {}) {
    const filterStr = JSON.stringify(filters);
    return `${table}:${filterStr}`;
  }

  /**
   * Set cache dengan TTL
   */
  set(key, value, duration = CACHE_DURATION.MEDIUM) {
    const expiresAt = Date.now() + duration;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get cache jika masih valid
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  /**
   * Invalidate cache untuk table tertentu
   */
  invalidate(table) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${table}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear semua cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cacheManager = new CacheManager();
export { CACHE_DURATION };

/**
 * Wrapper untuk fetch dengan caching
 */
export async function fetchWithCache(
  table,
  fetchFn,
  filters = {},
  cacheDuration = CACHE_DURATION.MEDIUM
) {
  const key = cacheManager.generateKey(table, filters);

  // Check cache
  const cached = cacheManager.get(key);
  if (cached) {
    console.log(`[Cache HIT] ${key}`);
    return cached;
  }

  // Fetch data
  console.log(`[Cache MISS] ${key}`);
  const data = await fetchFn();

  // Store in cache
  cacheManager.set(key, data, cacheDuration);

  return data;
}
