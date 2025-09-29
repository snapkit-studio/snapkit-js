import { describe, expect, it } from 'vitest';

import type {
  ImageTransforms,
  NextImageProps,
  PictureSource,
  ProcessedImageUrl,
  SnapkitConfig,
  SnapkitImageProps,
} from '../types';

// This file provides compile-time tests to verify the correctness of type definitions.
// It focuses on type validation through the TypeScript compiler rather than actual runtime tests.

describe('Type definition validation', () => {
  describe('ImageTransforms interface', () => {
    it('should allow all fields to be optional', () => {
      const emptyTransforms: ImageTransforms = {};
      expect(emptyTransforms).toBeDefined();

      const fullTransforms: ImageTransforms = {
        width: 800,
        height: 600,
        fit: 'cover',
        flip: true,
        flop: false,
        blur: 10,
        grayscale: true,
        extract: { x: 0, y: 0, width: 100, height: 100 },
        quality: 85,
        format: 'webp',
      };
      expect(fullTransforms).toBeDefined();
    });

    it('should allow valid fit option values', () => {
      const validFits: ImageTransforms['fit'][] = [
        'contain',
        'cover',
        'fill',
        'inside',
        'outside',
        undefined,
      ];

      validFits.forEach((fit) => {
        const transform: ImageTransforms = { fit };
        expect(transform.fit).toBe(fit);
      });
    });

    it('should allow valid format option values', () => {
      const validFormats: ImageTransforms['format'][] = [
        'jpeg',
        'jpg',
        'png',
        'webp',
        'avif',
        'auto',
        undefined,
      ];

      validFormats.forEach((format) => {
        const transform: ImageTransforms = { format };
        expect(transform.format).toBe(format);
      });
    });

    it('should allow blur as number or boolean', () => {
      const numericBlur: ImageTransforms = { blur: 15 };
      const booleanBlur: ImageTransforms = { blur: true };

      expect(numericBlur.blur).toBe(15);
      expect(booleanBlur.blur).toBe(true);
    });

    it('should have correct extract structure', () => {
      const transform: ImageTransforms = {
        extract: {
          x: 10,
          y: 20,
          width: 100,
          height: 150,
        },
      };

      expect(transform.extract?.x).toBe(10);
      expect(transform.extract?.y).toBe(20);
      expect(transform.extract?.width).toBe(100);
      expect(transform.extract?.height).toBe(150);
    });
  });

  describe('NextImageProps interface', () => {
    it('should have properties compatible with Next.js Image component', () => {
      const props: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        fill: false,
        sizes: '(max-width: 768px) 100vw, 50vw',
        quality: 85,
        priority: true,
        loading: 'eager',
        onLoad: () => {},
        onError: () => {},
        className: 'test-class',
        style: { border: '1px solid red' },
      };

      expect(props.src).toBe('test.jpg');
      expect(props.alt).toBe('Test image');
      expect(props.loading).toBe('eager');
    });
    it('should allow valid loading values', () => {
      const lazyLoading: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        loading: 'lazy',
      };

      const eagerLoading: NextImageProps = {
        src: 'test.jpg',
        alt: 'Test',
        loading: 'eager',
      };

      expect(lazyLoading.loading).toBe('lazy');
      expect(eagerLoading.loading).toBe('eager');
    });
  });

  describe('SnapkitImageProps interface', () => {
    it('should extend NextImageProps functionality', () => {
      const props: SnapkitImageProps = {
        src: 'test.jpg',
        alt: 'Test image',
        width: 800,
        height: 600,
        transforms: {
          blur: 20,
          grayscale: true,
        },
        // Next.js props
        priority: true,
        loading: 'eager',
        className: 'test-class',
        onClick: () => {},
      };

      expect(props.transforms?.blur).toBe(20);
    });

    it('should allow valid optimizeFormat values', () => {
      const formatOptions: ImageTransforms['format'][] = [
        'avif',
        'webp',
        'auto',
        undefined,
      ];

      formatOptions.forEach((format) => {
        const props: SnapkitImageProps = {
          src: 'test.jpg',
          alt: 'Test',
          transforms: {
            format: format,
          },
        };

        expect(props.transforms?.format).toBe(format);
      });
    });
  });

  describe('PictureSource interface', () => {
    it('should correctly define required and optional properties', () => {
      const minimalSource: PictureSource = {
        src: 'mobile.jpg',
        width: 400,
        height: 300,
      };

      const fullSource: PictureSource = {
        media: '(max-width: 768px)',
        src: 'mobile.jpg',
        width: 400,
        height: 300,
        transforms: {
          fit: 'cover',
          quality: 80,
        },
      };

      expect(minimalSource.src).toBe('mobile.jpg');
      expect(minimalSource.width).toBe(400);
      expect(minimalSource.height).toBe(300);

      expect(fullSource.media).toBe('(max-width: 768px)');
      expect(fullSource.transforms?.fit).toBe('cover');
    });
  });

  describe('SnapkitConfig interface', () => {
    it('should require cdnConfig, defaultQuality and defaultFormat', () => {
      const minimalConfig: SnapkitConfig = {
        cdnConfig: {
          provider: 'snapkit',
          organizationName: 'test-org',
        },
        defaultQuality: 85,
        defaultFormat: 'auto',
      };
      expect(minimalConfig.cdnConfig.organizationName).toBe('test-org');
      expect(minimalConfig.defaultQuality).toBe(85);
      expect(minimalConfig.defaultFormat).toBe('auto');

      const fullConfig: SnapkitConfig = {
        cdnConfig: {
          provider: 'custom',
          baseUrl: 'https://cdn.example.com',
        },
        defaultQuality: 85,
        defaultFormat: 'auto',
      };

      expect(fullConfig.cdnConfig.baseUrl).toBe('https://cdn.example.com');
      expect(fullConfig.defaultQuality).toBe(85);
      expect(fullConfig.defaultFormat).toBe('auto');
    });

    it('should allow valid defaultFormat values', () => {
      const formats: SnapkitConfig['defaultFormat'][] = [
        'avif',
        'webp',
        'auto',
        undefined,
      ];

      formats.forEach((format) => {
        const config: SnapkitConfig = {
          cdnConfig: {
            provider: 'snapkit',
            organizationName: 'test-org',
          },
          defaultQuality: 85,
          defaultFormat: format,
        };
        expect(config.defaultFormat).toBe(format);
      });
    });
  });

  describe('ProcessedImageUrl interface', () => {
    it('should represent image URL processing results', () => {
      const minimalUrl: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
      };

      const fullUrl: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
        srcSet:
          'https://test.com/image-400.jpg 400w, https://test.com/image-800.jpg 800w',
        sources: {
          avif: 'https://test.com/image.avif',
          webp: 'https://test.com/image.webp',
          original: 'https://test.com/image.jpg',
        },
      };

      expect(minimalUrl.src).toBe('https://test.com/image.jpg');
      expect(fullUrl.srcSet).toContain('400w');
      expect(fullUrl.sources?.avif).toBe('https://test.com/image.avif');
      expect(fullUrl.sources?.webp).toBe('https://test.com/image.webp');
      expect(fullUrl.sources?.original).toBe('https://test.com/image.jpg');
    });

    it('should make sources optional', () => {
      const urlWithoutSources: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
        srcSet: 'https://test.com/image-400.jpg 400w',
      };

      expect(urlWithoutSources.sources).toBeUndefined();
    });

    it('should make srcSet optional', () => {
      const urlWithoutSrcSet: ProcessedImageUrl = {
        src: 'https://test.com/image.jpg',
        sources: {
          webp: 'https://test.com/image.webp',
        },
      };

      expect(urlWithoutSrcSet.srcSet).toBeUndefined();
    });
  });

  describe('Generic and utility types', () => {
    it('should work correctly with Pick and Omit', () => {
      // Check type with src excluded from SnapkitImageProps
      type PicturePropsWithoutSrc = Omit<SnapkitImageProps, 'src'>;

      const propsWithoutSrc: PicturePropsWithoutSrc = {
        alt: 'Test',
        width: 800,
      };

      expect(propsWithoutSrc.alt).toBe('Test');
      expect(propsWithoutSrc.width).toBe(800);

      // Select only specific properties from ImageTransforms
      type SizeTransforms = Pick<ImageTransforms, 'width' | 'height' | 'fit'>;

      const sizeTransforms: SizeTransforms = {
        width: 800,
        height: 600,
        fit: 'cover',
      };

      expect(sizeTransforms.width).toBe(800);
      expect(sizeTransforms.height).toBe(600);
      expect(sizeTransforms.fit).toBe('cover');
    });
  });
});
