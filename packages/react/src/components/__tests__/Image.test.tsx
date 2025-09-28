import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Image } from '../Image';

// Mock hooks
vi.mock('../../hooks', () => ({
  useImageConfig: vi.fn(() => ({
    organizationName: 'test-org',
    baseUrl: 'https://cdn.test.com',
    defaultQuality: 85,
    defaultOptimizeFormat: 'auto',
    imageUrl: 'https://cdn.test.com/test.jpg?optimized',
    srcSet:
      'https://cdn.test.com/test.jpg?w=400 1x, https://cdn.test.com/test.jpg?w=800 2x',
    imageSize: {
      width: 800,
      height: 600,
    },
    finalTransforms: {},
    adjustedQuality: 85,
  })),
  useImageLazyLoading: vi.fn(() => ({
    imgRef: { current: null },
    isInView: true,
    isLoaded: false,
    setIsLoaded: vi.fn(),
  })),
  useImagePreload: vi.fn(() => ({
    preloadImage: vi.fn(),
  })),
}));

// Mock utils
vi.mock('../../utils', () => ({
  createContainerStyle: vi.fn(() => ({})),
  createImageStyle: vi.fn(() => ({})),
  createReservedSpace: vi.fn(() => ({ paddingBottom: '75%' })),
  getImageUrl: vi.fn((src: string) => `${src}?optimized`),
}));

describe('Image', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Basic rendering', () => {
    it('should render img element with required props', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('width', '800');
      expect(img).toHaveAttribute('height', '600');
    });

    it('should apply custom className', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
          className="custom-class"
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toHaveClass('custom-class');
    });
  });

  describe('Fill mode', () => {
    it('should not require width/height when fill is true', () => {
      render(<Image src="/test.jpg" alt="Test image" fill={true} />);

      const img = screen.getByAltText('Test image');
      expect(img).not.toHaveAttribute('width');
      expect(img).not.toHaveAttribute('height');
    });
  });

  describe('Event handlers', () => {
    it('should call onLoad when image loads', () => {
      const onLoad = vi.fn();
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
          onLoad={onLoad}
        />,
      );

      const img = screen.getByAltText('Test image');
      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('should call onError when image fails to load', () => {
      const onError = vi.fn();
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
          onError={onError}
        />,
      );

      const img = screen.getByAltText('Test image');
      fireEvent.error(img);

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading states', () => {
    it('should set loading="lazy" by default', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Sizes attribute', () => {
    it('should use sizes attribute when provided', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    });
  });

  describe('Transform props', () => {
    it('should render with transforms', () => {
      const transforms = {
        blur: 10,
        grayscale: true,
        quality: 90,
      };

      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
          transforms={transforms}
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Placeholder handling', () => {
    it('should handle blur data URL', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={800}
          height={600}
          blurDataURL="data:image/jpeg;base64,..."
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should always have alt text', () => {
      render(<Image src="/test.jpg" alt="" width={800} height={600} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should support decorative images', () => {
      render(
        <Image
          src="/test.jpg"
          alt=""
          width={800}
          height={600}
          role="presentation"
        />,
      );

      const img = screen.getByRole('presentation');
      expect(img).toHaveAttribute('alt', '');
    });
  });

  describe('Error handling', () => {
    it('should handle missing src gracefully', () => {
      render(<Image src="" alt="Test image" width={800} height={600} />);

      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
    });

    it('should handle invalid dimensions', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test image"
          width={-100}
          height={0}
        />,
      );

      const img = screen.getByAltText('Test image');
      expect(img).toBeInTheDocument();
    });
  });
});
