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

      expect(result).toContain('transform=w%3A800%2Ch%3A600%2Cfit%3Acover');
      expect(result).toContain('?transform=');
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
      expect(result).toContain('transform=w%3A800%2Cquality%3A90');
    });

    it('should generate URL with DPR parameter', () => {
      const transforms: ImageTransforms = {
        width: 200,
        height: 200,
        dpr: 2,
        quality: 85,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('transform=');
      expect(result).toContain('w%3A200');
      expect(result).toContain('h%3A200');
      expect(result).toContain('dpr%3A2');
      expect(result).toContain('quality%3A85');
    });

    it('should generate URL with flip parameters (boolean without values)', () => {
      const transforms: ImageTransforms = {
        flip: true,
        flop: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      // flip and flop should appear without values
      expect(result).toContain('transform=flip%2Cflop');
    });

    it('should generate URL with visual effect parameters', () => {
      const transforms: ImageTransforms = {
        blur: 10,
        grayscale: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('transform=');
      expect(result).toContain('blur%3A10');
      expect(result).toContain('grayscale');
    });

    it('should set blur without value when blur is boolean true', () => {
      const transforms: ImageTransforms = {
        blur: true,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      // blur should appear without value when true
      expect(result).toContain('transform=blur');
      expect(result).not.toContain('blur%3Atrue');
    });

    it('should generate URL with extract region parameters using hyphen separator', () => {
      const transforms: ImageTransforms = {
        extract: {
          x: 25,
          y: 10,
          width: 50,
          height: 75,
        },
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      // extract should use hyphen separator: extract:25-10-50-75
      expect(result).toContain('transform=extract%3A25-10-50-75');
    });

    it('should generate URL with format and quality parameters', () => {
      const transforms: ImageTransforms = {
        format: 'webp',
        quality: 85,
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).toContain('transform=');
      expect(result).toContain('format%3Awebp');
      expect(result).toContain('quality%3A85');
    });

    it('should not include auto format in URL', () => {
      const transforms: ImageTransforms = {
        format: 'auto',
      };
      const result = urlBuilder.buildTransformedUrl('test.jpg', transforms);

      expect(result).not.toContain('format');
      expect(result).toBe('https://test-org-cdn.snapkit.studio/test.jpg');
    });

    // URL-based transformation tests
    it('should handle complete URLs with url parameter (no transforms)', () => {
      const externalUrl = 'https://cdn.example.com/photos/image.jpg';
      const result = urlBuilder.buildTransformedUrl(externalUrl, {});

      expect(result).toContain('/image?');
      expect(result).toContain('url=https%3A%2F%2Fcdn.example.com%2Fphotos%2Fimage.jpg');
      expect(result).not.toContain('transform=');
    });

    it('should handle complete URLs with url and transform parameters', () => {
      const externalUrl = 'https://cdn.example.com/photos/image.jpg';
      const transforms: ImageTransforms = {
        width: 800,
        height: 600,
        quality: 85,
      };
      const result = urlBuilder.buildTransformedUrl(externalUrl, transforms);

      expect(result).toContain('/image?');
      expect(result).toContain('url=https%3A%2F%2Fcdn.example.com%2Fphotos%2Fimage.jpg');
      expect(result).toContain('transform=w%3A800%2Ch%3A600%2Cquality%3A85');
    });

    it('should handle CloudFront URLs with transformations', () => {
      const cloudfrontUrl = 'https://d1234567890.cloudfront.net/assets/banner.png';
      const transforms: ImageTransforms = {
        width: 1200,
        format: 'webp',
        quality: 90,
      };
      const result = urlBuilder.buildTransformedUrl(cloudfrontUrl, transforms);

      expect(result).toBe(
        'https://test-org-cdn.snapkit.studio/image?url=https%3A%2F%2Fd1234567890.cloudfront.net%2Fassets%2Fbanner.png&transform=w%3A1200%2Cformat%3Awebp%2Cquality%3A90',
      );
    });

    it('should handle http:// URLs (not just https://)', () => {
      const httpUrl = 'http://cdn.example.com/image.jpg';
      const transforms: ImageTransforms = {
        width: 400,
      };
      const result = urlBuilder.buildTransformedUrl(httpUrl, transforms);

      expect(result).toContain('/image?');
      expect(result).toContain('url=http%3A%2F%2Fcdn.example.com%2Fimage.jpg');
      expect(result).toContain('transform=w%3A400');
    });

    it('should apply all transform types to external URLs', () => {
      const externalUrl = 'https://storage.googleapis.com/bucket/image.jpg';
      const transforms: ImageTransforms = {
        width: 500,
        height: 300,
        fit: 'cover',
        blur: 5,
        grayscale: true,
        format: 'avif',
        quality: 95,
      };
      const result = urlBuilder.buildTransformedUrl(externalUrl, transforms);

      expect(result).toContain('url=https%3A%2F%2Fstorage.googleapis.com%2Fbucket%2Fimage.jpg');
      expect(result).toContain('w%3A500');
      expect(result).toContain('h%3A300');
      expect(result).toContain('fit%3Acover');
      expect(result).toContain('blur%3A5');
      expect(result).toContain('grayscale');
      expect(result).toContain('format%3Aavif');
      expect(result).toContain('quality%3A95');
    });
  });

  describe('buildFormatUrls Method', () => {
    it('should generate URLs for AVIF, WebP, and original formats', () => {
      const transforms: ImageTransforms = {
        width: 800,
        quality: 85,
      };
      const result = urlBuilder.buildFormatUrls('test.jpg', transforms);

      expect(result.avif).toContain('transform=');
      expect(result.avif).toContain('format%3Aavif');
      expect(result.avif).toContain('w%3A800');

      expect(result.webp).toContain('transform=');
      expect(result.webp).toContain('format%3Awebp');
      expect(result.webp).toContain('w%3A800');

      expect(result.original).toContain('transform=');
      expect(result.original).not.toContain('format');
      expect(result.original).toContain('w%3A800');
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

      expect(result).toContain('transform=');
      expect(result).toContain('w%3A400');
      expect(result).toContain('400w');
      expect(result).toContain('w%3A800');
      expect(result).toContain('800w');
      expect(result).toContain('w%3A1200');
      expect(result).toContain('1200w');
      expect(result).toContain('quality%3A85');
      expect(result).toContain('fit%3Acover');
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

      expect(result).toContain('transform=');
      expect(result).toContain('w%3A200');
      expect(result).toContain('h%3A200');
      expect(result).toContain('dpr%3A1');
      expect(result).toContain('1x');
      expect(result).toContain('dpr%3A2');
      expect(result).toContain('2x');
      expect(result).toContain('dpr%3A3');
      expect(result).toContain('3x');
      expect(result).toContain('quality%3A85');
      expect(result).toContain('format%3Awebp');
    });

    it('should use default DPR values when not specified', () => {
      const result = urlBuilder.buildDprSrcSet('test.jpg', 100, 100, {
        quality: 75,
      });

      expect(result).toContain('transform=');
      expect(result).toContain('w%3A100');
      expect(result).toContain('h%3A100');
      expect(result).toContain('dpr%3A1');
      expect(result).toContain('1x');
      expect(result).toContain('dpr%3A2');
      expect(result).toContain('2x');
      expect(result).toContain('dpr%3A3');
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

      expect(result).toContain('transform=');
      expect(result).toContain('w%3A150');
      expect(result).toContain('dpr%3A1');
      expect(result).toContain('1x');
      expect(result).toContain('dpr%3A2');
      expect(result).toContain('2x');
      expect(result).not.toContain('h%3A');
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

      expect(result).toContain('transform=');
      expect(result).toContain('w%3A120');
      expect(result).toContain('h%3A80');
      expect(result).toContain('dpr%3A1');
      expect(result).toContain('dpr%3A1.5');
      expect(result).toContain('dpr%3A2');
      expect(result).toContain('dpr%3A3');
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
      expect(result).toContain('transform=');
      expect(result).toContain('w%3A133');
      expect(result).toContain('h%3A77');
      expect(result).toContain('dpr%3A1.5');
      expect(result).toContain('dpr%3A2.5');
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

      expect(result).toContain('transform=');
      expect(result).toContain('quality%3A95');
      expect(result).toContain('format%3Aavif');
      expect(result).toContain('fit%3Acover');
      expect(result).toContain('blur%3A5');
      expect(result).toContain('dpr%3A1');
      expect(result).toContain('dpr%3A2');
    });
  });
});
