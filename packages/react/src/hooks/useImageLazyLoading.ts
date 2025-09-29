'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { createEnhancedLazyLoadObserver, shouldLoadEagerly } from '../utils';

interface UseImageLazyLoadingProps {
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

/**
 * Hook for handling image lazy loading with Intersection Observer
 * Includes comprehensive memory leak prevention
 */
export function useImageLazyLoading({
  priority = false,
  loading,
}: UseImageLazyLoadingProps) {
  const shouldLoadEager = shouldLoadEagerly(priority, loading);
  const [isVisible, setIsVisible] = useState(shouldLoadEager);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isUnmountedRef = useRef(false);

  // Callback to handle intersection with safety check
  const handleIntersection = useCallback(() => {
    // Check if component is still mounted before updating state
    if (!isUnmountedRef.current) {
      setIsVisible(true);
      // Note: unobserve is now handled automatically in createEnhancedLazyLoadObserver
      // to prevent memory leaks and duplicate unobserve calls
    }
  }, []);

  // Enhanced lazy loading setup with proper cleanup
  useEffect(() => {
    // Reset unmounted flag when effect runs
    isUnmountedRef.current = false;

    if (shouldLoadEager || isVisible) return;

    const currentImgRef = imgRef.current;

    // Create observer with error handling
    try {
      const observer = createEnhancedLazyLoadObserver(handleIntersection);

      if (observer && currentImgRef) {
        observerRef.current = observer;
        observer.observe(currentImgRef);
      }
    } catch (error) {
      console.warn('Failed to create IntersectionObserver:', error);
      // Fallback: load image immediately if observer fails
      setIsVisible(true);
    }

    // Cleanup function with comprehensive resource cleanup
    return () => {
      isUnmountedRef.current = true;

      // Disconnect observer and clean up references
      if (observerRef.current) {
        // Unobserve specific element if it still exists
        if (currentImgRef) {
          try {
            observerRef.current.unobserve(currentImgRef);
          } catch (error) {
            // Element might be already removed from DOM
            console.debug('Failed to unobserve element:', error);
          }
        }

        // Disconnect the observer completely
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [shouldLoadEager, isVisible, handleIntersection]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  return {
    isVisible,
    imgRef,
    shouldLoadEager,
  };
}
