import {
  getBestSupportedFormat,
  ImageTransforms,
  SnapkitUrlBuilder,
  CdnConfig,
} from '@snapkit-studio/core';

export interface CreateImageUrlOptions {
  organizationName: string;
  baseUrl?: string;
  width?: number;
  height?: number;
  quality?: number;
  transforms?: ImageTransforms;
  defaultFormat?: 'avif' | 'webp' | 'auto';
}

/**
 * Create optimized image URL using Snapkit URL builder
 */
export function createImageUrl(
  src: string,
  options: CreateImageUrlOptions,
): string {
  const cdnConfig: CdnConfig = options.baseUrl
    ? {
        provider: 'custom',
        baseUrl: options.baseUrl,
      }
    : {
        provider: 'snapkit',
        organizationName: options.organizationName,
      };

  const urlBuilder = new SnapkitUrlBuilder(cdnConfig);

  // Determine optimal format
  const format =
    options.defaultFormat === 'auto'
      ? getBestSupportedFormat()
      : options.defaultFormat;

  // Combine transforms with sizing options
  const transforms: ImageTransforms = {
    ...options.transforms,
    width: options.width,
    height: options.height,
    quality: options.quality,
    format,
  };

  return urlBuilder.buildTransformedUrl(src, transforms);
}
