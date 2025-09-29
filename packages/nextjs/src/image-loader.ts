import {
  getCdnConfig,
  SnapkitConfig,
  SnapkitImageEngine,
} from '@snapkit-studio/core';
import { ImageLoader } from 'next/image';

/**
 * Default Snapkit image loader for Next.js
 * Uses the unified SnapkitImageEngine with environment configuration
 *
 * @param params - Image loader parameters from Next.js
 * @returns Optimized image URL
 * @throws {Error} When configuration is not available
 * @throws {Error} When invalid parameters are provided
 */
export const snapkitLoader: ImageLoader = ({ src, width, quality }): string => {
  // Use createSnapkitLoader for consistent behavior
  const loader = createSnapkitLoader();
  return loader({ src, width, quality });
};

/**
 * Create a custom Snapkit image loader with specific configuration
 * Uses the new unified SnapkitImageEngine for consistent behavior
 *
 * @returns Image loader function compatible with Next.js Image component
 * @throws {Error} When invalid configuration options are provided
 */
export function createSnapkitLoader(): ImageLoader {
  // Use the new getCdnConfig function to get CDN configuration
  const cdnConfig = getCdnConfig();

  // Create unified image engine configuration
  const config: SnapkitConfig = {
    cdnConfig,
    defaultQuality: 85,
    defaultFormat: 'auto',
  };

  let imageEngine: SnapkitImageEngine;

  try {
    imageEngine = new SnapkitImageEngine(config);
  } catch (error) {
    throw new Error(
      'Failed to create Snapkit image engine: ' +
        (error instanceof Error ? error.message : String(error)) +
        '. Please verify your configuration is correct.',
    );
  }

  // Return Next.js compatible loader using the unified engine
  return imageEngine.createNextJsLoader();
}
