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
    const baseUrl = this.buildImageUrl(src);
    const params = this.buildQueryParams(transforms);

    // Only add query params if there are any
    if (!params) {
      return baseUrl;
    }

    // Check if the resulting URL already has query params
    if (baseUrl.includes('?')) {
      return `${baseUrl}&${params}`;
    }

    return `${baseUrl}?${params}`;
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
  private buildQueryParams(transforms: ImageTransforms): string {
    const params = new URLSearchParams();

    // Size adjustment
    if (transforms.width) params.set('w', transforms.width.toString());
    if (transforms.height) params.set('h', transforms.height.toString());
    if (transforms.fit) params.set('fit', transforms.fit);

    // Device Pixel Ratio for high-DPI displays
    if (transforms.dpr) params.set('dpr', transforms.dpr.toString());

    // Flipping
    if (transforms.flip) params.set('flip', 'true');
    if (transforms.flop) params.set('flop', 'true');

    // Visual effects
    if (transforms.blur) {
      params.set(
        'blur',
        transforms.blur === true ? 'true' : transforms.blur.toString(),
      );
    }
    if (transforms.grayscale) params.set('grayscale', 'true');

    // Region extraction
    if (transforms.extract) {
      const { x, y, width, height } = transforms.extract;
      params.set('extract', `${x},${y},${width},${height}`);
    }

    // Format and quality - exclude 'auto' format from URL
    if (transforms.format && transforms.format !== 'auto') {
      params.set('format', transforms.format);
    }
    if (transforms.quality) {
      params.set('quality', transforms.quality.toString());
    }

    return params.toString();
  }
}
