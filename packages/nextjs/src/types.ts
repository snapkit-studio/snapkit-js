import type { ImageTransforms } from '@snapkit-studio/core';
import type { ImageProps } from 'next/image';

/**
 * Snapkit Image Props extending Next.js Image Props
 */
export interface SnapkitImageProps extends Omit<ImageProps, 'loader'> {
  /**
   * Image transforms to apply
   *
   * width, height, quality are not allowed to be passed through transforms
   * because they are handled by the loader.
   */
  transforms?: Omit<ImageTransforms, 'width' | 'height' | 'quality'>;

  /**
   * DPR (Device Pixel Ratio) options (client-only feature)
   */
  dprOptions?: {
    maxDpr?: number;
    qualityStep?: number;
  };

  /**
   * Event handlers (client-only features)
   */
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}
