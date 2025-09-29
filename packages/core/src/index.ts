// Type definitions
export type { NetworkSpeed } from './responsive';
export type {
  CdnConfig,
  CdnProvider,
  ImageTransforms,
  NextImageProps,
  PictureSource,
  ProcessedImageUrl,
  SnapkitConfig,
  SnapkitEnvConfig,
  SnapkitImageProps,
} from './types';

// URL Builder
export { SnapkitUrlBuilder } from './url-builder';
export { UrlBuilderFactory } from './url-builder-factory';

// Format Detection
export {
  estimateFormatSupportFromUA,
  formatSupport,
  getBestSupportedFormat,
  getSupportedFormatsFromAcceptHeader,
  preloadFormatSupport,
  supportsImageFormat,
} from './format-detection';

// Responsive Utilities
export {
  adjustQualityForConnection,
  calculateImageSizes,
  calculateOptimalImageSize,
  createLazyLoadObserver,
  DEFAULT_BREAKPOINTS,
  detectNetworkSpeed,
  determineImagePriority,
  generateResponsiveWidths,
  getDeviceCharacteristics,
  parseImageSizes,
} from './responsive';

// DPR Detection Utilities
export {
  getDevicePixelRatio,
  getNetworkAwareDprLimit,
  getOptimalDprValues,
  shouldUse3xImages,
  supportsHighEfficiencyFormats,
} from './dpr-detection';
export type { DprDetectionOptions } from './dpr-detection';

// Transform Builder
export { SnapkitTransformBuilder } from './transform-builder';

// Image Engine
export { SnapkitImageEngine } from './image-engine';
export { ImageEngineCache } from './image-engine-cache';
export type {
  ImageEngineParams,
  ImageRenderData,
  ValidationResult,
} from './image-engine';

// Environment Configuration
export {
  detectEnvironment,
  environmentStrategies,
  getCdnConfig,
  getEnvironmentDebugInfo,
  universalStrategy,
} from './env-config';
export type { EnvironmentStrategy } from './env-config';

// Browser Compatibility
export {
  checkAvifSupport,
  checkWebpSupport,
  getFormatSupportFromUA,
  parseBrowserInfo,
} from './browser-compatibility';
export type { BrowserInfo, FormatSupport } from './browser-compatibility';

// Utility Functions
export {
  calculateSizeReduction,
  extractDimensionsFromUrl,
  formatBytes,
  isSnapkitUrl,
} from './utils';

// Constants
export {
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_SSR_VIEWPORT_HEIGHT,
  DEFAULT_SSR_VIEWPORT_WIDTH,
  MAX_IMAGE_HEIGHT,
  MAX_IMAGE_WIDTH,
  MIN_IMAGE_QUALITY,
  MAX_IMAGE_QUALITY,
  MOBILE_BREAKPOINT,
} from './constants';
