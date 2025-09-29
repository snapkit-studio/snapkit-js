import type { CdnConfig } from './types';
import { SnapkitUrlBuilder } from './url-builder';

/**
 * Factory pattern for caching and reusing SnapkitUrlBuilder instances
 * Prevents creating new instances for the same configuration
 */
export class UrlBuilderFactory {
  private static instances = new Map<string, SnapkitUrlBuilder>();

  /**
   * Get or create a SnapkitUrlBuilder instance for the given CDN configuration
   * @param config - CDN configuration
   * @returns Cached or new SnapkitUrlBuilder instance
   */
  static getInstance(config: CdnConfig): SnapkitUrlBuilder {
    const key = this.createKey(config);

    if (!this.instances.has(key)) {
      const builder = new SnapkitUrlBuilder(config);
      this.instances.set(key, builder);
    }

    return this.instances.get(key)!;
  }

  /**
   * Clear all cached instances (useful for testing)
   */
  static clearCache(): void {
    this.instances.clear();
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
    return this.instances.size;
  }
}
