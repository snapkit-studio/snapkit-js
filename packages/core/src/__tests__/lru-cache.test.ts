import { describe, expect, it } from 'vitest';

import { LRUCache } from '../lru-cache';

describe('LRUCache', () => {
  describe('basic operations', () => {
    it('should store and retrieve values', () => {
      const cache = new LRUCache<string, number>(3);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBe(3);
    });

    it('should return undefined for non-existent keys', () => {
      const cache = new LRUCache<string, number>(3);

      expect(cache.get('missing')).toBeUndefined();
    });

    it('should check if key exists', () => {
      const cache = new LRUCache<string, number>(3);

      cache.set('exists', 42);

      expect(cache.has('exists')).toBe(true);
      expect(cache.has('missing')).toBe(false);
    });
  });

  describe('LRU eviction', () => {
    it('should evict least recently used item when at capacity', () => {
      const cache = new LRUCache<string, number>(3);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4); // Should evict 'a'

      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('should update LRU order on get', () => {
      const cache = new LRUCache<string, number>(3);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      // Access 'a' to make it most recently used
      cache.get('a');

      cache.set('d', 4); // Should evict 'b' instead of 'a'

      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });

    it('should update LRU order on set for existing key', () => {
      const cache = new LRUCache<string, number>(3);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      // Update 'a' to make it most recently used
      cache.set('a', 10);

      cache.set('d', 4); // Should evict 'b' instead of 'a'

      expect(cache.get('a')).toBe(10);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBe(3);
      expect(cache.get('d')).toBe(4);
    });
  });

  describe('cache management', () => {
    it('should clear all items', () => {
      const cache = new LRUCache<string, number>(3);

      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);

      cache.clear();

      expect(cache.size).toBe(0);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBeUndefined();
    });

    it('should report correct size', () => {
      const cache = new LRUCache<string, number>(5);

      expect(cache.size).toBe(0);

      cache.set('a', 1);
      expect(cache.size).toBe(1);

      cache.set('b', 2);
      expect(cache.size).toBe(2);

      cache.set('c', 3);
      expect(cache.size).toBe(3);

      cache.set('a', 10); // Update existing
      expect(cache.size).toBe(3);
    });

    it('should provide cache statistics', () => {
      const cache = new LRUCache<string, number>(4);

      cache.set('a', 1);
      cache.set('b', 2);

      const stats = cache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(4);
      expect(stats.usage).toBe(50); // 2/4 * 100
    });
  });

  describe('edge cases', () => {
    it('should handle cache size of 1', () => {
      const cache = new LRUCache<string, number>(1);

      cache.set('a', 1);
      expect(cache.get('a')).toBe(1);

      cache.set('b', 2);
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe(2);
    });

    it('should throw error for invalid cache size', () => {
      expect(() => new LRUCache<string, number>(0)).toThrow(
        'LRU cache size must be positive',
      );
      expect(() => new LRUCache<string, number>(-1)).toThrow(
        'LRU cache size must be positive',
      );
    });

    it('should handle different key types', () => {
      const cache = new LRUCache<number, string>(3);

      cache.set(1, 'one');
      cache.set(2, 'two');
      cache.set(3, 'three');

      expect(cache.get(1)).toBe('one');
      expect(cache.get(2)).toBe('two');
      expect(cache.get(3)).toBe('three');
    });
  });

  describe('performance', () => {
    it('should handle large cache efficiently', () => {
      const cache = new LRUCache<number, string>(10000);
      const startTime = Date.now();

      // Add 10000 items
      for (let i = 0; i < 10000; i++) {
        cache.set(i, `value-${i}`);
      }

      // Access items
      for (let i = 0; i < 1000; i++) {
        cache.get(Math.floor(Math.random() * 10000));
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
      expect(cache.size).toBe(10000);
    });
  });
});
