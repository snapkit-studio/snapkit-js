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
      this.baseUrl = `https://${config.organizationName}-cdn.snapkit.studio`;
    } else if (config.provider === 'custom') {
      if (!config.baseUrl) {
        throw new Error('baseUrl is required when using custom provider');
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
      return src;
    }

    // Add slash if not starting with one
    const path = src.startsWith('/') ? src : `/${src}`;

    return `${this.baseUrl}${path}`;
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

    if (src.includes('?')) {
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
