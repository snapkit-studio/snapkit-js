import { ComponentProps } from 'react';

// Image transformation options
export interface ImageTransforms {
  // Size adjustment
  width?: number;
  height?: number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

  // Device Pixel Ratio for high-DPI displays
  dpr?: number;

  // Flipping
  flip?: boolean;
  flop?: boolean;

  // Visual effects
  blur?: number | boolean;
  grayscale?: boolean;

  // Region extraction (percentage-based: 0-100)
  extract?: {
    /** Starting x-coordinate as percentage (0-100) */
    x: number;
    /** Starting y-coordinate as percentage (0-100) */
    y: number;
    /** Width of extracted region as percentage (0-100) */
    width: number;
    /** Height of extracted region as percentage (0-100) */
    height: number;
  };

  // Others
  quality?: number;
  format?: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'auto';
}

// Props compatible with Next.js Image component
export interface NextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Snapkit exclusive props
export interface SnapkitImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: string;

  // Next.js compatible props
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  blurDataURL?: string;

  // Snapkit exclusive features
  transforms?: ImageTransforms;
  dprOptions?: {
    maxDpr?: number;
    autoDetect?: boolean;
    forceDpr?: number;
    customDprs?: number[];
  };
  adjustQualityByNetwork?: boolean;
}

// Source definition for Picture component
export interface PictureSource {
  media?: string;
  src: string;
  width: number;
  height: number;
  transforms?: ImageTransforms;
}

// CDN provider types
export type CdnProvider = 'snapkit' | 'custom';

export interface CdnConfig {
  provider: CdnProvider;
  organizationName?: string; // Required for snapkit provider
  baseUrl?: string; // Required for custom provider
}

// Provider configuration
export interface SnapkitConfig {
  cdnConfig: CdnConfig;
  /**
   * Default image quality (1-100)
   * @default 85
   */
  defaultQuality: number;
  /**
   * Default image format
   * @default 'auto'
   */
  defaultFormat: ImageTransforms['format'];
}

// Environment-based configuration (serverless-friendly)
export interface SnapkitEnvConfig {
  /** Default organization name */
  SNAPKIT_ORGANIZATION_NAME?: string;
  /** Default image quality (1-100) */
  SNAPKIT_DEFAULT_QUALITY?: number;
  /** Enable/disable format optimization */
  SNAPKIT_DEFAULT_OPTIMIZE_FORMAT?: 'avif' | 'webp' | 'auto';
}

// Internal use types
export interface ProcessedImageUrl {
  src: string;
  srcSet?: string;
  sources?: {
    avif?: string;
    webp?: string;
    original?: string;
  };
}
