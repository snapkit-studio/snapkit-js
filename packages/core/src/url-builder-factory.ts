import type { CdnConfig } from './types';
import { SnapkitUrlBuilder } from './url-builder';
import { LRUCache } from './lru-cache';

/**
 * Factory pattern for caching and reusing SnapkitUrlBuilder instances
 * Prevents creating new instances for the same configuration
 * Uses LRU cache to limit memory usage
 */
export class UrlBuilderFactory {
  private static cache = new LRUCache<string, SnapkitUrlBuilder>(50);
  private static queryParamsCache = new LRUCache<string, string>(200);

  /**
   * Get or create a SnapkitUrlBuilder instance for the given CDN configuration
   * @param config - CDN configuration
   * @returns Cached or new SnapkitUrlBuilder instance
   */
  static getInstance(config: CdnConfig): SnapkitUrlBuilder {
    const key = this.createKey(config);

    let builder = this.cache.get(key);
    if (!builder) {
      builder = new SnapkitUrlBuilder(config);
      this.cache.set(key, builder);
    }

    return builder;
  }

  /**
   * Clear all cached instances (useful for testing)
   */
  static clearCache(): void {
    this.cache.clear();
    this.queryParamsCache.clear();
  }

  /**
   * Create a unique key for the configuration
   * @param config - CDN configuration
   * @returns Unique key string
   */
  private static createKey(config: CdnConfig): string {
    if (config.provider === 'snapkit') {
      return `snapkit:${config.organizationName}`;
    } else if (config.provider === 'custom') {
      return `custom:${config.baseUrl}`;
    }
    throw new Error(`Unsupported CDN provider: ${config.provider}`);
  }

  /**
   * Get the number of cached instances (for debugging/monitoring)
   */
  static getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics for monitoring and debugging
   */
  static getCacheStats(): {
    builders: { size: number; maxSize: number; usage: number };
    queryParams: { size: number; maxSize: number; usage: number };
  } {
    return {
      builders: this.cache.getStats(),
      queryParams: this.queryParamsCache.getStats(),
    };
  }

  /**
   * Cache query parameters for performance optimization
   */
  static getCachedQueryParams(key: string, generator: () => string): string {
    let params = this.queryParamsCache.get(key);
    if (!params) {
      params = generator();
      this.queryParamsCache.set(key, params);
    }
    return params;
  }
}
