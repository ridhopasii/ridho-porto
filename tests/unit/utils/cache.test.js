/**
 * Tests for Cache Manager
 */

const cache = require('../../../src/utils/cache');

describe('CacheManager', () => {
  beforeEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('should set and get a value', () => {
      cache.set('test-key', 'test-value');
      const value = cache.get('test-key');
      expect(value).toBe('test-value');
    });

    it('should return null for non-existent key', () => {
      const value = cache.get('non-existent');
      expect(value).toBeNull();
    });

    it('should set value with TTL', () => {
      cache.set('ttl-key', 'ttl-value', 1);
      const value = cache.get('ttl-key');
      expect(value).toBe('ttl-value');
    });
  });

  describe('del', () => {
    it('should delete a key', () => {
      cache.set('delete-key', 'delete-value');
      cache.del('delete-key');
      const value = cache.get('delete-key');
      expect(value).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('stats-key', 'stats-value');
      const stats = cache.getStats();
      expect(stats).toBeDefined();
      expect(stats.keys).toBeGreaterThan(0);
    });
  });
});
