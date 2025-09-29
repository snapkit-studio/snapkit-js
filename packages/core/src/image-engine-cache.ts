import { SnapkitImageEngine } from './image-engine';
import type { SnapkitConfig } from './types';

/**
 * Cache for SnapkitImageEngine instances to prevent recreation
 * and improve performance
 */
export class ImageEngineCache {
  private static instances = new Map<string, SnapkitImageEngine>();
  private static lastAccessTime = new Map<string, number>();
  private static readonly MAX_CACHE_SIZE = 10;
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get or create a SnapkitImageEngine instance for the given configuration
   * @param config - Snapkit configuration
   * @returns Cached or new SnapkitImageEngine instance
   */
  static getInstance(config: SnapkitConfig): SnapkitImageEngine {
    const key = this.createKey(config);
    const now = Date.now();

    // Check if cached instance exists and is still valid
    if (this.instances.has(key)) {
      const lastAccess = this.lastAccessTime.get(key) || 0;

      // If instance is too old, remove it
      if (now - lastAccess > this.CACHE_TTL) {
        this.instances.delete(key);
        this.lastAccessTime.delete(key);
      } else {
        // Update last access time and return cached instance
        this.lastAccessTime.set(key, now);
        return this.instances.get(key)!;
      }
    }

    // Clean up old entries if cache is too large
    if (this.instances.size >= this.MAX_CACHE_SIZE) {
      this.cleanupOldEntries();
    }

    // Create new instance
    const engine = new SnapkitImageEngine(config);
    this.instances.set(key, engine);
    this.lastAccessTime.set(key, now);

    return engine;
  }

  /**
   * Clear all cached instances (useful for testing)
   */
  static clearCache(): void {
    this.instances.clear();
    this.lastAccessTime.clear();
  }

  /**
   * Create a unique key for the configuration
   * @param config - Snapkit configuration
   * @returns Unique key string
   */
  private static createKey(config: SnapkitConfig): string {
    // Create a deterministic key from config properties
    const keyParts = [
      config.cdnConfig.provider,
      config.cdnConfig.organizationName || config.cdnConfig.baseUrl,
      config.defaultQuality || 85,
      config.defaultFormat || 'auto',
    ];

    return keyParts.join('-');
  }

  /**
   * Clean up oldest entries when cache is full
   */
  private static cleanupOldEntries(): void {
    // Find the oldest entry
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, time] of this.lastAccessTime.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    // Remove the oldest entry
    if (oldestKey) {
      this.instances.delete(oldestKey);
      this.lastAccessTime.delete(oldestKey);
    }
  }

  /**
   * Get the number of cached instances (for debugging/monitoring)
   */
  static getCacheSize(): number {
    return this.instances.size;
  }

  /**
   * Get cache statistics (for debugging/monitoring)
   */
  static getCacheStats(): {
    size: number;
    maxSize: number;
    ttl: number;
    entries: Array<{ key: string; age: number }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.lastAccessTime.entries()).map(
      ([key, time]) => ({
        key,
        age: now - time,
      }),
    );

    return {
      size: this.instances.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.CACHE_TTL,
      entries,
    };
  }
}
