'use client';

import { ImageTransforms, SnapkitUrlBuilder } from '@snapkit-studio/core';
import NextImage, { ImageLoader } from 'next/image';
import { useMemo } from 'react';

import { createSnapkitLoader } from './image-loader';
import type { SnapkitImageProps } from './types';
import { calculateEnhancedStyle } from './utils';
import { parseEnvConfig } from './utils/env-config';

/**
 * Creates a custom loader that applies transforms and network-based quality adjustment
 * Integrates transform logic with the loader for consistent URL generation
 */
function createTransformLoader(
  transforms: ImageTransforms | undefined,
): ImageLoader {
  const envConfig = parseEnvConfig();

  console.log('envConfig', envConfig);
  const urlBuilder = new SnapkitUrlBuilder(envConfig.organizationName);
  const baseLoader = createSnapkitLoader();

  return ({ src, width, quality }) => {
    console.log('src', src);
    console.log('width', width);
    console.log('quality', quality);

    // Apply transforms if provided
    const processedSrc = urlBuilder.buildTransformedUrl(src, transforms || {});

    // Apply optimization with network-based quality adjustment
    return baseLoader({
      src: processedSrc,
      width,
      quality,
    });
  };
}

/**
 * Client Component version of Snapkit Image
 * Supports client-side features like event handlers and network adaptation
 * Renders with dynamic optimization based on device and network conditions
 */
export function Image({
  src,
  transforms,
  style,
  onLoad,
  onError,
  ...props
}: SnapkitImageProps) {
  const isUrlImageSource = typeof src === 'string';

  // Memoize loader creation to prevent recreating on every render
  const loader = createTransformLoader(transforms);

  // Memoize width/height calculations
  const { numWidth, numHeight } = useMemo(() => {
    const width = props.width
      ? typeof props.width === 'number'
        ? props.width
        : parseInt(String(props.width), 10)
      : undefined;

    const height = props.height
      ? typeof props.height === 'number'
        ? props.height
        : parseInt(String(props.height), 10)
      : undefined;

    return { numWidth: width, numHeight: height };
  }, [props.width, props.height]);

  // Memoize enhanced style calculation
  const enhancedStyle = useMemo(
    () => calculateEnhancedStyle(numWidth, numHeight, style),
    [numWidth, numHeight, style],
  );

  console.log('isUrlImageSource', isUrlImageSource);
  if (!isUrlImageSource) {
    // For static imports, use Next.js Image without Snapkit optimization
    return (
      <NextImage
        {...props}
        src={src}
        style={enhancedStyle}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  // The loader handles both transforms and optimization
  // No need to pre-transform the src, loader will handle it
  return (
    <NextImage
      {...props}
      className={props.className}
      src={src}
      loader={loader}
      style={enhancedStyle}
      onLoad={onLoad}
      onError={onError}
      unoptimized={false}
    />
  );
}
