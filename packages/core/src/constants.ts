/**
 * Core constants used throughout the Snapkit library
 */

// Image Quality Constants
export const DEFAULT_IMAGE_QUALITY = 85;
export const MIN_IMAGE_QUALITY = 1;
export const MAX_IMAGE_QUALITY = 100;

// Network-based Quality Adjustments
export const QUALITY_REDUCTION_SAVE_DATA = 30;
export const QUALITY_REDUCTION_2G = 40;
export const QUALITY_REDUCTION_3G = 20;
export const MIN_QUALITY_SAVE_DATA = 40;
export const MIN_QUALITY_2G = 30;
export const MIN_QUALITY_3G = 50;

// Image Size Limits
export const DEFAULT_FILL_WIDTH = 1920;
export const MAX_IMAGE_WIDTH = 3840; // 4K level
export const MAX_IMAGE_HEIGHT = 2160; // 4K level

// Mobile Breakpoint
export const MOBILE_BREAKPOINT = 768;

// Default Server-side Values (SSR fallbacks)
export const DEFAULT_SSR_VIEWPORT_WIDTH = 1920;
export const DEFAULT_SSR_VIEWPORT_HEIGHT = 1080;

// Intersection Observer Defaults
export const DEFAULT_LAZY_LOAD_ROOT_MARGIN = '50px';
export const DEFAULT_LAZY_LOAD_THRESHOLD = 0.1;

// Cache Settings
export const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const MAX_CACHE_SIZE = 10;

// File Size Constants
export const BYTES_PER_KB = 1024;

// Browser Version Thresholds for Format Support
export const MIN_CHROME_VERSION_AVIF = 85;
export const MIN_FIREFOX_VERSION_AVIF = 93;
export const MIN_EDGE_VERSION_AVIF = 91;
export const MIN_CHROME_VERSION_WEBP = 23;
export const MIN_FIREFOX_VERSION_WEBP = 65;
export const MIN_EDGE_VERSION_WEBP = 14;
export const MIN_SAFARI_VERSION_WEBP = 14;

// iOS Version Constants
export const IOS_AVIF_ISSUE_VERSION_MAJOR = 16;
export const IOS_AVIF_ISSUE_VERSION_MINOR_START = 0;
export const IOS_AVIF_ISSUE_VERSION_MINOR_END = 3;
export const IOS_AVIF_SUPPORT_VERSION_MINOR = 4;
export const IOS_WEBP_SUPPORT_VERSION_MAJOR = 14;
