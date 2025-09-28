import { SnapkitConfig, SnapkitImageEngine } from '@snapkit-studio/core';
import { ImageLoader } from 'next/image';

import { parseEnvConfig } from './utils/env-config';

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
  const envConfig = parseEnvConfig();

  if (!envConfig.organizationName) {
    throw new Error(
      'NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME is not set. ' +
        'Please add NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME to your .env file or environment variables. ' +
        'For Next.js, all Snapkit environment variables must use the NEXT_PUBLIC_ prefix.',
    );
  }

  // Create unified image engine configuration
  const config: SnapkitConfig = {
    organizationName: envConfig.organizationName,
    defaultQuality: envConfig.defaultQuality,
    defaultFormat: envConfig.defaultFormat,
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
