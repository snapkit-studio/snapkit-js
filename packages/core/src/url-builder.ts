import {
  createSecurityError,
  isValidPath,
  isValidUrl,
  sanitizePath,
} from './security-utils';
import { CdnConfig, ImageTransforms } from './types';

/**
 * Generate image URLs with different CDN providers
 */
export class SnapkitUrlBuilder {
  private baseUrl: string;

  constructor(config: CdnConfig) {
    if (config.provider === 'snapkit') {
      if (!config.organizationName) {
        throw new Error(
          'organizationName is required when using snapkit provider',
        );
      }
      // Validate organization name format
      if (!/^[a-z0-9-]+$/.test(config.organizationName)) {
        throw new Error(
          'organizationName must only contain lowercase letters, numbers, and hyphens',
        );
      }
      this.baseUrl = `https://${config.organizationName}-cdn.snapkit.studio`;
    } else if (config.provider === 'custom') {
      if (!config.baseUrl) {
        throw new Error('baseUrl is required when using custom provider');
      }
      // Validate custom base URL
      if (!isValidUrl(config.baseUrl)) {
        throw createSecurityError(
          'custom CDN URL validation',
          config.baseUrl,
          'Invalid or potentially malicious URL',
        );
      }
      this.baseUrl = config.baseUrl;
    } else {
      throw new Error(`Unsupported CDN provider: ${config.provider}`);
    }
  }

  /**
   * Generate basic image URL
   */
  buildImageUrl(src: string): string {
    // Return as-is if already complete URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      // Validate URL to prevent malicious URLs
      if (!isValidUrl(src)) {
        throw createSecurityError(
          'image URL validation',
          src,
          'Invalid or potentially malicious URL',
        );
      }
      return src;
    }

    // Split path and query parameters
    const [path, query] = src.split('?');

    // Validate and sanitize path
    if (!isValidPath(path)) {
      throw createSecurityError(
        'image path validation',
        path,
        'Invalid or potentially malicious path',
      );
    }

    // Sanitize and normalize the path
    const sanitizedPath = sanitizePath(path);

    // Reconstruct URL with query parameters if they exist
    const fullUrl = `${this.baseUrl}${sanitizedPath}`;
    return query ? `${fullUrl}?${query}` : fullUrl;
  }

  /**
   * Generate image URL with transformation parameters
   */
  buildTransformedUrl(src: string, transforms: ImageTransforms): string {
    // Check if src is a complete URL (http:// or https://)
    const isCompleteUrl = src.startsWith('http://') || src.startsWith('https://');

    if (isCompleteUrl) {
      // URL-based approach: use url query parameter
      // Validate the URL for security
      if (!isValidUrl(src)) {
        throw createSecurityError(
          'external URL validation',
          src,
          'Invalid or potentially malicious URL',
        );
      }

      const params = new URLSearchParams();
      params.set('url', src);

      const transformString = this.buildTransformString(transforms);
      if (transformString) {
        params.set('transform', transformString);
      }

      // Use /image endpoint for URL-based transformations
      return `${this.baseUrl}/image?${params.toString()}`;
    } else {
      // Path-based approach: traditional path + transform parameter
      const baseUrl = this.buildImageUrl(src);
      const transformString = this.buildTransformString(transforms);

      // Only add transform param if there are any transforms
      if (!transformString) {
        return baseUrl;
      }

      // Build the transform query parameter
      const params = new URLSearchParams();
      params.set('transform', transformString);

      // Check if the resulting URL already has query params
      if (baseUrl.includes('?')) {
        return `${baseUrl}&${params.toString()}`;
      }

      return `${baseUrl}?${params.toString()}`;
    }
  }

  /**
   * Generate format-specific URLs (for picture tags)
   */
  buildFormatUrls(
    src: string,
    transforms: ImageTransforms,
  ): { avif?: string; webp?: string; original: string } {
    const baseTransforms = { ...transforms };

    return {
      avif: this.buildTransformedUrl(src, {
        ...baseTransforms,
        format: 'avif',
      }),
      webp: this.buildTransformedUrl(src, {
        ...baseTransforms,
        format: 'webp',
      }),
      original: this.buildTransformedUrl(src, {
        ...baseTransforms,
        format: undefined,
      }),
    };
  }

  /**
   * Generate srcset string (for responsive images)
   */
  buildSrcSet(
    src: string,
    widths: number[],
    transforms: Omit<ImageTransforms, 'width'>,
  ): string {
    return widths
      .map((width) => {
        const url = this.buildTransformedUrl(src, { ...transforms, width });
        return `${url} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Generate DPR-based srcset string (like Next.js Image)
   * Creates URLs with different device pixel ratios for crisp display on high-DPI devices
   */
  buildDprSrcSet(
    src: string,
    baseWidth: number,
    baseHeight: number | undefined,
    transforms: Omit<ImageTransforms, 'width' | 'height' | 'dpr'>,
    dprs: number[] = [1, 2, 3],
  ): string {
    return dprs
      .map((dpr) => {
        const url = this.buildTransformedUrl(src, {
          ...transforms,
          width: baseWidth,
          height: baseHeight,
          dpr,
        });
        return `${url} ${dpr}x`;
      })
      .join(', ');
  }

  /**
   * Convert transformation parameters to query string
   */
  private buildTransformString(transforms: ImageTransforms): string {
    const parts: string[] = [];

    // Size adjustment
    if (transforms.width) parts.push(`w:${transforms.width}`);
    if (transforms.height) parts.push(`h:${transforms.height}`);
    if (transforms.fit) parts.push(`fit:${transforms.fit}`);

    // Device Pixel Ratio for high-DPI displays
    if (transforms.dpr) parts.push(`dpr:${transforms.dpr}`);

    // Flipping - Boolean options without value
    if (transforms.flip) parts.push('flip');
    if (transforms.flop) parts.push('flop');

    // Visual effects
    if (transforms.blur) {
      // If blur is true, add key only; if number, add with value
      parts.push(transforms.blur === true ? 'blur' : `blur:${transforms.blur}`);
    }
    if (transforms.grayscale) parts.push('grayscale');

    // Region extraction - use hyphen separator
    if (transforms.extract) {
      const { x, y, width, height } = transforms.extract;
      parts.push(`extract:${x}-${y}-${width}-${height}`);
    }

    // Format and quality - exclude 'auto' format from URL
    if (transforms.format && transforms.format !== 'auto') {
      parts.push(`format:${transforms.format}`);
    }
    if (transforms.quality) {
      parts.push(`quality:${transforms.quality}`);
    }

    return parts.join(',');
  }
}
