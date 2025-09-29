// Main component
export { Image } from './components/Image';

// Hooks
export { useUnifiedImageEngine } from './hooks';

// Re-export core types that are commonly used in React components
export type {
  ImageTransforms,
  NextImageProps,
  SnapkitConfig,
  SnapkitImageProps,
} from '@snapkit-studio/core';

// Re-export core utilities for demo and advanced usage
export {
  detectNetworkSpeed,
  getDevicePixelRatio,
  getOptimalDprValues,
} from '@snapkit-studio/core';

// Utils for advanced usage
export { isUrlImageSource, requiresClientFeatures } from './types';
export { createPreloadHint } from './utils/loadingOptimization';
