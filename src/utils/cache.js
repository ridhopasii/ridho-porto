/**
 * Cache Manager using node-cache
 */

const NodeCache = require('node-cache');
const logger = require('../config/logger');

class CacheManager {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // Default TTL: 10 minutes
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false,
    });

    this.cache.on('expired', (key) => {
      logger.debug(`Cache key expired: ${key}`);
    });
  }

  get(key) {
    try {
      const value = this.cache.get(key);
      if (value) {
        logger.debug(`Cache hit: ${key}`);
        return value;
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  set(key, value, ttl) {
    try {
      this.cache.set(key, value, ttl);
      logger.debug(`Cache set: ${key}`);
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  del(key) {
    try {
      this.cache.del(key);
      logger.debug(`Cache deleted: ${key}`);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  clear() {
    try {
      this.cache.flushAll();
      logger.info('Cache cleared');
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheManager();
