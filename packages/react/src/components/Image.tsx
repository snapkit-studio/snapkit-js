'use client';

import { SnapkitImageProps } from '@snapkit-studio/core';
import { forwardRef, useEffect, useMemo, useState } from 'react';

import { useImageConfig, useImageLazyLoading, useImagePreload } from '../hooks';
import {
  createContainerStyle,
  createImageStyle,
  createReservedSpace,
} from '../utils';

export const Image = forwardRef<HTMLImageElement, SnapkitImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill = false,
      sizes,
      priority = false,
      loading,
      transforms = {},
      dprOptions,
      adjustQualityByNetwork = true,
      style,
      ...props
    },
    ref,
  ) => {
    // Check if src is a string URL
    const isUrlImageSource = typeof src === 'string';

    // Provider-less image optimization hook
    const { imageUrl, srcSet, imageSize } = useImageConfig({
      src,
      width,
      height,
      fill,
      sizes,
      transforms,
      dprOptions,
      adjustQualityByNetwork,
    });

    // Client-side hydration state to avoid hydration mismatch
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    // Lazy loading hook
    const { isVisible, imgRef, shouldLoadEager } = useImageLazyLoading({
      priority,
      loading,
    });

    // Preload hook for priority images
    useImagePreload({
      priority,
      imageUrl,
      sizes,
    });

    // Consolidate all style calculations into a single useMemo for better performance
    const { reservedSpace, imageStyle, containerStyle } = useMemo(() => {
      const reserved = createReservedSpace(fill, width, height);
      const imgStyle = createImageStyle(style, fill);
      const containerStyles = createContainerStyle(fill, reserved);

      return {
        reservedSpace: reserved,
        imageStyle: imgStyle,
        containerStyle: containerStyles,
      };
    }, [fill, width, height, style]);

    // Combined ref handling
    const setRefs = (node: HTMLImageElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      // @ts-expect-error - imgRef is managed internally
      imgRef.current = node;
    };

    // Return basic image for non-string sources
    if (!isUrlImageSource) {
      return (
        <img
          ref={ref}
          src={src as string}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          style={style}
          loading={loading || 'lazy'}
          {...props}
        />
      );
    }

    // For hydration consistency, always render the same attributes on server and client
    // On the server and during initial client render, only show for priority/eager images
    // After hydration, allow lazy loading to work normally
    const shouldRenderSrcSet =
      priority || shouldLoadEager || (hasMounted && isVisible);

    // Main image content - Always render img element for IntersectionObserver to work
    const content = (
      <img
        ref={setRefs}
        src={shouldRenderSrcSet ? imageUrl : undefined}
        data-src={imageUrl} // Store actual URL for lazy loading
        srcSet={shouldRenderSrcSet ? srcSet || undefined : undefined}
        sizes={sizes}
        alt={alt}
        width={fill ? undefined : imageSize.width}
        height={fill ? undefined : imageSize.height}
        loading={loading || (shouldLoadEager ? 'eager' : 'lazy')}
        style={imageStyle}
        // ARIA attributes for better accessibility
        role="img"
        aria-busy={!shouldRenderSrcSet ? 'true' : 'false'}
        aria-label={shouldRenderSrcSet ? alt : `Loading: ${alt}`}
        {...props}
      />
    );

    // Return with appropriate wrapper based on layout mode
    if (fill || reservedSpace) {
      return <div style={containerStyle}>{content}</div>;
    }

    return content;
  },
);

Image.displayName = 'Image';
