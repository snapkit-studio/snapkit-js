'use client';

import {
  DprDetectionOptions,
  getCdnConfig,
  ImageEngineParams,
  ImageRenderData,
  SnapkitConfig,
  SnapkitImageEngine,
} from '@snapkit-studio/core';
import { useEffect, useMemo, useRef } from 'react';

interface UseUnifiedImageEngineProps extends Omit<ImageEngineParams, 'src'> {
  src: string;
  // React-specific options
  defaultQuality?: number;
  defaultFormat?: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'auto';
}

/**
 * Custom hook to track hydration state for consistent SSR/client rendering
 */
function useHydrationState() {
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    hasHydratedRef.current = true;
  }, []);

  return hasHydratedRef.current;
}

/**
 * Create hydration-safe DPR options that ensure consistent server/client rendering
 */
function createHydrationSafeDprOptions(
  originalOptions: DprDetectionOptions | undefined,
  hasHydrated: boolean,
): DprDetectionOptions {
  // During initial render (before hydration), force auto-detection off
  // to ensure server and client generate the same srcSet
  if (!hasHydrated) {
    return {
      ...originalOptions,
      autoDetect: false, // Force standard DPR set during hydration
    };
  }

  // After hydration, allow full client-side optimization
  return originalOptions || {};
}

/**
 * React hook that uses the unified SnapkitImageEngine
 * Provides the same functionality as useImageConfig but with consistent core logic
 * Includes hydration-safe DPR detection to prevent SSR/client mismatches
 */
export function useUnifiedImageEngine(
  props: UseUnifiedImageEngineProps,
): ImageRenderData {
  // Track hydration state to ensure consistent DPR detection
  const hasHydrated = useHydrationState();
  // Create image engine with CDN configuration
  const imageEngine = useMemo(() => {
    try {
      const cdnConfig = getCdnConfig();
      const config: SnapkitConfig = {
        cdnConfig,
        defaultQuality: props.defaultQuality || 85,
        defaultFormat: props.defaultFormat || 'auto',
      };
      return new SnapkitImageEngine(config);
    } catch (error) {
      throw new Error(
        'Failed to create Snapkit image engine: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }, [props.defaultQuality, props.defaultFormat]);

  // Generate image data using the unified engine
  const imageData = useMemo((): ImageRenderData => {
    // Create hydration-safe DPR options
    const safeDprOptions = createHydrationSafeDprOptions(
      props.dprOptions,
      hasHydrated,
    );

    const engineParams: ImageEngineParams = {
      src: props.src,
      width: props.width,
      height: props.height,
      fill: props.fill,
      sizes: props.sizes,
      quality: props.quality,
      transforms: props.transforms,
      adjustQualityByNetwork: props.adjustQualityByNetwork,
      dprOptions: safeDprOptions,
    };

    try {
      return imageEngine.generateImageData(engineParams);
    } catch (error) {
      throw new Error(
        'Failed to generate image data: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }, [
    imageEngine,
    props.src,
    props.width,
    props.height,
    props.fill,
    props.sizes,
    props.quality,
    props.transforms,
    props.adjustQualityByNetwork,
    props.dprOptions,
    hasHydrated,
  ]);

  return imageData;
}
