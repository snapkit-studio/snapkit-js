import { beforeEach, describe, expect, it } from 'vitest';

import type { CdnConfig, ImageTransforms } from '../types';
import { SnapkitUrlBuilder } from '../url-builder';

describe('SnapkitUrlBuilder Class', () => {
  let urlBuilder: SnapkitUrlBuilder;
  let snapkitConfig: CdnConfig;
  let customConfig: CdnConfig;

  beforeEach(() => {
    snapkitConfig = {
      provider: 'snapkit',
      organizationName: 'test-org',
    };
    customConfig = {
      provider: 'custom',
      baseUrl: 'https://custom.domain.com',
    };
    urlBuilder = new SnapkitUrlBuilder(snapkitConfig);
  });

  describe('Constructor', () => {
    it('should create instance with snapkit provider config', () => {
      const builder = new SnapkitUrlBuilder(snapkitConfig);

      expect(builder).toBeInstanceOf(SnapkitUrlBuilder);
    });

    it('should create instance with custom provider config', () => {
      const builder = new SnapkitUrlBuilder(customConfig);

      expect(builder).toBeInstanceOf(SnapkitUrlBuilder);
    });

    it('should generate correct base URL from snapkit organization name', () => {
      const builder = new SnapkitUrlBuilder(snapkitConfig);
      const result = builder.buildImageUrl('test.jpg');

      expect(result).toBe('https://test-org-cdn.snapkit.studio/test.jpg');
    });

    it('should use custom base URL when provided', () => {
      const builder = new SnapkitUrlBuilder(customConfig);
      const result = builder.buildImageUrl('test.jpg');

      expect(result).toBe('https://custom.domain.com/test.jpg');
    });

    it('should throw error for snapkit provider without organization name', () => {
      const invalidConfig: CdnConfig = {
        provider: 'snapkit',
        // Missing organizationName
      };

      expect(() => {
        new SnapkitUrlBuilder(invalidConfig);
      }).toThrow('organizationName is required when using snapkit provider');
    });

    it('should throw error for custom provider without base URL', () => {
      const invalidConfig: CdnConfig = {
        provider: 'custom',
        // Missing baseUrl
      };

      expect(() => {
        new SnapkitUrlBuilder(invalidConfig);
      }).toThrow('baseUrl is required when using custom provider');
    });
  });

  describe('buildImageUrl Method', () => {
    it('should generate basic image URL', () => {
      const result = urlBuilder.buildImageUrl('test.jpg');

      expect(result).toBe('https://test-org-cdn.snapkit.studio/test.jpg');
    });

    it('should return complete URLs as-is', () => {
      const httpUrl = 'http://example.com/image.jpg';
      const httpsUrl = 'https://example.com/image.jpg';

      expect(urlBuilder.buildImageUrl(httpUrl)).toBe(httpUrl);
      expect(urlBuilder.buildImageUrl(httpsUrl)).toBe(httpsUrl);
    });

    it('should add slash to paths not starting with slash', () => {
      const result = urlBuilder.buildImageUrl('folder/test.jpg');

      expect(result).toBe(
        'https://test-org-cdn.snapkit.studio/folder/test.jpg',
      );
    });

    it('should use paths already starting with slash as-is', () => {
      const result = urlBuilder.buildImageUrl('/folder/test.jpg');

      expect(result).toBe(
        'https://test-org-cdn.snapkit.studio/folder/test.jpg',
      );
    });
  });

  describe('buildTransformedUrl Method', () => {
    it('should return basic URL when no transform parameters', () => {
      const transforms: ImageTransforms = {};
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toBe('https://test-org-cdn.snapkit.studio/test.jpg');
    });

    it('should generate URL with size transform parameters', () => {
      const transforms: ImageTransforms = {
        width: 800,
        height: 600,
        fit: 'cover',
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('w=800');
      expect(result).toContain('h=600');
      expect(result).toContain('fit=cover');
    });

    it('should append transforms when URL already has query parameters', () => {
      const transforms: ImageTransforms = {
        width: 800,
        quality: 90,
      };
      const result = urlBuilder.buildTransformedUrl(
        'test.jpg?v=123',
        transforms,
      );

      expect(result).toContain('test.jpg?v=123&');
      expect(result).toContain('w=800');
      expect(result).toContain('quality=90');
    });

    it('should generate URL with DPR parameter', () => {
      const transforms: ImageTransforms = {
        width: 200,
        height: 200,
        dpr: 2,
        quality: 85,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('w=200');
      expect(result).toContain('h=200');
      expect(result).toContain('dpr=2');
      expect(result).toContain('quality=85');
    });

    it('should generate URL with flip parameters', () => {
      const transforms: ImageTransforms = {
        flip: true,
        flop: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('flip=true');
      expect(result).toContain('flop=true');
    });

    it('should generate URL with visual effect parameters', () => {
      const transforms: ImageTransforms = {
        blur: 10,
        grayscale: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('blur=10');
      expect(result).toContain('grayscale=true');
    });

    it('should set blur to "true" when blur is boolean true', () => {
      const transforms: ImageTransforms = {
        blur: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('blur=true');
    });

    it('should generate URL with extract region parameters', () => {
      const transforms: ImageTransforms = {
        extract: {
          x: 25,
          y: 10,
          width: 50,
          height: 75,
        },
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('extract=25%2C10%2C50%2C75');
    });

    it('should generate URL with format and quality parameters', () => {
      const transforms: ImageTransforms = {
        format: 'webp',
        quality: 85,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('format=webp');
      expect(result).toContain('quality=85');
    });

    it('should not include auto format in URL', () => {
      const transforms: ImageTransforms = {
        format: 'auto',
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).not.toContain('format');
    });
  });

  describe('buildFormatUrls Method', () => {
    it('should generate URLs for AVIF, WebP, and original formats', () => {
      const transforms: ImageTransforms = {
        width: 800,
        quality: 85,
      };
      const result = urlBuilder.buildFormatUrls('test.jpg', transforms);

      expect(result.avif).toContain('format=avif');
      expect(result.avif).toContain('w=800');
      expect(result.webp).toContain('format=webp');
      expect(result.webp).toContain('w=800');
      expect(result.original).not.toContain('format');
      expect(result.original).toContain('w=800');
    });
  });

  describe('buildSrcSet Method', () => {
    it('should generate srcset string for multiple widths', () => {
      const widths = [400, 800, 1200];
      const transforms: ImageTransforms = {
        quality: 85,
        fit: 'cover',
      };
      const result = urlBuilder.buildSrcSet('test.jpg', widths, transforms);

      expect(result).toContain('w=400');
      expect(result).toContain('400w');
      expect(result).toContain('w=800');
      expect(result).toContain('800w');
      expect(result).toContain('w=1200');
      expect(result).toContain('1200w');
      expect(result).toContain('quality=85');
      expect(result).toContain('fit=cover');
    });

    it('should separate srcset string with comma and space', () => {
      const widths = [400, 800];
      const result = urlBuilder.buildSrcSet('test.jpg', widths, {});

      expect(result).toMatch(/400w,\s/);
      expect(result).toMatch(/800w$/);
    });
  });

  describe('buildDprSrcSet Method', () => {
    it('should generate DPR-based srcset string with all parameters', () => {
      const result = urlBuilder.buildDprSrcSet(
        'test.jpg',
        200,
        200,
        { quality: 85, format: 'webp' },
        [1, 2, 3],
      );

      expect(result).toContain('w=200&h=200&dpr=1');
      expect(result).toContain('1x');
      expect(result).toContain('w=200&h=200&dpr=2');
      expect(result).toContain('2x');
      expect(result).toContain('w=200&h=200&dpr=3');
      expect(result).toContain('3x');
      expect(result).toContain('quality=85');
      expect(result).toContain('format=webp');
    });

    it('should use default DPR values when not specified', () => {
      const result = urlBuilder.buildDprSrcSet('test.jpg', 100, 100, {
        quality: 75,
      });

      expect(result).toContain('w=100&h=100&dpr=1');
      expect(result).toContain('1x');
      expect(result).toContain('w=100&h=100&dpr=2');
      expect(result).toContain('2x');
      expect(result).toContain('w=100&h=100&dpr=3');
      expect(result).toContain('3x');
    });

    it('should work without height parameter', () => {
      const result = urlBuilder.buildDprSrcSet(
        'test.jpg',
        150,
        undefined,
        { quality: 90 },
        [1, 2],
      );

      expect(result).toContain('w=150&dpr=1');
      expect(result).toContain('1x');
      expect(result).toContain('w=150&dpr=2');
      expect(result).toContain('2x');
      expect(result).not.toContain('h=');
    });

    it('should separate srcset entries with comma and space', () => {
      const result = urlBuilder.buildDprSrcSet(
        'test.jpg',
        100,
        100,
        {},
        [1, 2],
      );

      expect(result).toMatch(/1x,\s/);
      expect(result).toMatch(/2x$/);
    });

    it('should maintain fixed dimensions for each DPR', () => {
      const result = urlBuilder.buildDprSrcSet(
        'test.jpg',
        120,
        80,
        {},
        [1, 1.5, 2, 3],
      );

      expect(result).toContain('w=120&h=80&dpr=1');
      expect(result).toContain('w=120&h=80&dpr=1.5');
      expect(result).toContain('w=120&h=80&dpr=2');
      expect(result).toContain('w=120&h=80&dpr=3');
    });

    it('should work with fractional DPR values', () => {
      const result = urlBuilder.buildDprSrcSet(
        'test.jpg',
        133,
        77,
        {},
        [1.5, 2.5],
      );

      // Dimensions should remain fixed regardless of DPR value
      expect(result).toContain('w=133&h=77&dpr=1.5');
      expect(result).toContain('w=133&h=77&dpr=2.5');
    });

    it('should work with custom transforms', () => {
      const result = urlBuilder.buildDprSrcSet(
        'test.jpg',
        200,
        200,
        {
          quality: 95,
          format: 'avif',
          fit: 'cover',
          blur: 5,
        },
        [1, 2],
      );

      expect(result).toContain('quality=95');
      expect(result).toContain('format=avif');
      expect(result).toContain('fit=cover');
      expect(result).toContain('blur=5');
      expect(result).toContain('dpr=1');
      expect(result).toContain('dpr=2');
    });
  });
});
