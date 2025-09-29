import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environmentStrategies, getCdnConfig } from '../env-config';
import { SnapkitImageEngine } from '../image-engine';
import { CdnConfig, SnapkitConfig } from '../types';
import { UrlBuilderFactory } from '../url-builder-factory';

describe('Integration Tests', () => {
  const config: SnapkitConfig = {
    cdnConfig: {
      provider: 'snapkit',
      organizationName: 'test-org',
    },
    defaultQuality: 80,
    defaultFormat: 'auto',
  };

  describe('Cross-framework consistency', () => {
    it('should generate identical URLs for same parameters across frameworks', () => {
      const engine = new SnapkitImageEngine(config);

      // Next.js-style usage through loader (height not supported in Next.js loader)
      const nextjsLoader = engine.createNextJsLoader();
      const nextjsUrl = nextjsLoader({
        src: 'test.jpg',
        width: 800,
        quality: 85,
      });

      // React-style usage without height for fair comparison
      const reactDataNoHeight = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        quality: 85,
        adjustQualityByNetwork: false,
      });

      // URLs should be identical for same parameters
      expect(reactDataNoHeight.url).toBe(nextjsUrl);
    });

    it('should handle environment-specific features consistently', () => {
      const engine = new SnapkitImageEngine(config);

      // Test srcSet generation consistency
      const imageData = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        height: 600,
      });

      expect(imageData.srcSet).toBeDefined();
      expect(imageData.srcSet.length).toBeGreaterThan(0);
      expect(imageData.url).toContain('test.jpg');
    });

    it('should maintain API compatibility', () => {
      const engine = new SnapkitImageEngine(config);

      // Test that all expected methods exist
      expect(typeof engine.generateImageData).toBe('function');
      expect(typeof engine.createNextJsLoader).toBe('function');
      expect(typeof engine.validateParams).toBe('function');
      expect(typeof engine.getConfig).toBe('function');
      expect(typeof engine.getUrlBuilder).toBe('function');
    });
  });

  describe('Configuration consistency', () => {
    it('should apply same defaults across different usage patterns', () => {
      const engine = new SnapkitImageEngine(config);

      const data1 = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
      });

      const data2 = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        transforms: {},
      });

      // Should generate same output for equivalent inputs
      expect(data1.transforms.format).toBe(data2.transforms.format);
      expect(data1.transforms.quality).toBe(data2.transforms.quality);
    });

    it('should handle edge cases consistently', () => {
      const engine = new SnapkitImageEngine(config);

      // Fill mode
      const fillData = engine.generateImageData({
        src: 'test.jpg',
        fill: true,
      });

      expect(fillData.size.width).toBe(1920);
      expect(fillData.size.height).toBeUndefined();
      expect(fillData.srcSet).toBeDefined();

      // With sizes
      const sizesData = engine.generateImageData({
        src: 'test.jpg',
        width: 800,
        sizes: '(max-width: 768px) 100vw, 50vw',
      });

      expect(sizesData.srcSet).toBeDefined();
      expect(sizesData.srcSet).toContain('w'); // Width descriptors
    });
  });

  describe('Error handling consistency', () => {
    it('should throw consistent errors for invalid config', () => {
      expect(() => {
        new SnapkitImageEngine({
          cdnConfig: { provider: 'snapkit', organizationName: '' },
        } as any);
      }).toThrow('organizationName is required');
    });

    it('should validate parameters consistently', () => {
      const engine = new SnapkitImageEngine(config);

      const invalidParams = {
        src: '',
        width: -100,
        quality: 150,
      };

      const result = engine.validateParams(invalidParams);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3);
    });

    it('should handle generateImageData errors consistently', () => {
      const engine = new SnapkitImageEngine(config);

      expect(() => {
        engine.generateImageData({
          src: '',
          width: -100,
        });
      }).toThrow('Invalid parameters');
    });
  });

  describe('CDN Provider Integration Tests', () => {
    beforeEach(() => {
      // Clear factory cache before each test
      UrlBuilderFactory.clearCache();
    });

    describe('UrlBuilderFactory with CDN providers', () => {
      it('should cache instances by CDN provider and configuration', () => {
        const snapkitConfig: CdnConfig = {
          provider: 'snapkit',
          organizationName: 'test-org',
        };

        const customConfig: CdnConfig = {
          provider: 'custom',
          baseUrl: 'https://cdn.example.com',
        };

        // Get instances
        const snapkitBuilder1 = UrlBuilderFactory.getInstance(snapkitConfig);
        const snapkitBuilder2 = UrlBuilderFactory.getInstance(snapkitConfig);
        const customBuilder = UrlBuilderFactory.getInstance(customConfig);

        // Same config should return same instance
        expect(snapkitBuilder1).toBe(snapkitBuilder2);

        // Different config should return different instance
        expect(snapkitBuilder1).not.toBe(customBuilder);

        // Should have 2 cached instances
        expect(UrlBuilderFactory.getCacheSize()).toBe(2);
      });

      it('should generate different cache keys for different CDN providers', () => {
        const config1: CdnConfig = {
          provider: 'snapkit',
          organizationName: 'test-org',
        };

        const config2: CdnConfig = {
          provider: 'custom',
          baseUrl: 'https://test-org-cdn.example.com',
        };

        const builder1 = UrlBuilderFactory.getInstance(config1);
        const builder2 = UrlBuilderFactory.getInstance(config2);

        expect(builder1).not.toBe(builder2);
        expect(UrlBuilderFactory.getCacheSize()).toBe(2);
      });

      it('should clear cache properly', () => {
        const config: CdnConfig = {
          provider: 'snapkit',
          organizationName: 'test-org',
        };

        UrlBuilderFactory.getInstance(config);
        expect(UrlBuilderFactory.getCacheSize()).toBe(1);

        UrlBuilderFactory.clearCache();
        expect(UrlBuilderFactory.getCacheSize()).toBe(0);
      });
    });

    describe('End-to-end CDN workflow', () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = { ...originalEnv };
      });

      afterEach(() => {
        process.env = originalEnv;
      });

      it('should work end-to-end with Snapkit CDN from environment', () => {
        // Set environment variables
        process.env.IMAGE_CDN_PROVIDER = 'snapkit';
        process.env.SNAPKIT_ORGANIZATION = 'my-company';

        // Get config from environment
        const nodejsStrategy = environmentStrategies.find(
          (s) => s.name === 'nodejs',
        )!;
        const config = getCdnConfig(nodejsStrategy);

        // Get builder from factory
        const builder = UrlBuilderFactory.getInstance(config);

        // Generate URL
        const url = builder.buildImageUrl('/photos/vacation.jpg');
        expect(url).toBe(
          'https://my-company-cdn.snapkit.studio/photos/vacation.jpg',
        );

        // Generate transformed URL
        const transformedUrl = builder.buildTransformedUrl(
          '/photos/vacation.jpg',
          {
            width: 800,
            height: 600,
            format: 'webp',
            quality: 85,
          },
        );
        expect(transformedUrl).toBe(
          'https://my-company-cdn.snapkit.studio/photos/vacation.jpg?w=800&h=600&format=webp&quality=85',
        );
      });

      it('should work end-to-end with CloudFront CDN from environment', () => {
        // Set environment variables for CloudFront
        process.env.IMAGE_CDN_PROVIDER = 'custom';
        process.env.IMAGE_CDN_URL = 'https://d1234567890.cloudfront.net';
        delete process.env.SNAPKIT_ORGANIZATION;

        // Get config from environment
        const nodejsStrategy = environmentStrategies.find(
          (s) => s.name === 'nodejs',
        )!;
        const config = getCdnConfig(nodejsStrategy);

        // Get builder from factory
        const builder = UrlBuilderFactory.getInstance(config);

        // Generate URL
        const url = builder.buildImageUrl('/images/products/item-1.png');
        expect(url).toBe(
          'https://d1234567890.cloudfront.net/images/products/item-1.png',
        );

        // Generate srcset
        const srcset = builder.buildSrcSet(
          '/images/products/item-1.png',
          [400, 800, 1200],
          {
            format: 'webp',
          },
        );
        expect(srcset).toBe(
          'https://d1234567890.cloudfront.net/images/products/item-1.png?w=400&format=webp 400w, ' +
            'https://d1234567890.cloudfront.net/images/products/item-1.png?w=800&format=webp 800w, ' +
            'https://d1234567890.cloudfront.net/images/products/item-1.png?w=1200&format=webp 1200w',
        );
      });

      it('should work end-to-end with Google Cloud Storage from environment', () => {
        // Set environment variables for GCS
        process.env.IMAGE_CDN_PROVIDER = 'custom';
        process.env.IMAGE_CDN_URL =
          'https://storage.googleapis.com/my-image-bucket';
        delete process.env.SNAPKIT_ORGANIZATION;

        // Get config from environment
        const nodejsStrategy = environmentStrategies.find(
          (s) => s.name === 'nodejs',
        )!;
        const config = getCdnConfig(nodejsStrategy);

        // Get builder from factory
        const builder = UrlBuilderFactory.getInstance(config);

        // Generate format URLs for picture element
        const formatUrls = builder.buildFormatUrls(
          '/galleries/2024/photo.jpg',
          {
            width: 1200,
            height: 800,
            quality: 90,
          },
        );

        expect(formatUrls.avif).toBe(
          'https://storage.googleapis.com/my-image-bucket/galleries/2024/photo.jpg?w=1200&h=800&format=avif&quality=90',
        );
        expect(formatUrls.webp).toBe(
          'https://storage.googleapis.com/my-image-bucket/galleries/2024/photo.jpg?w=1200&h=800&format=webp&quality=90',
        );
        expect(formatUrls.original).toBe(
          'https://storage.googleapis.com/my-image-bucket/galleries/2024/photo.jpg?w=1200&h=800&quality=90',
        );
      });

      it('should handle cache efficiency across different configurations', () => {
        // Create multiple configurations
        process.env.IMAGE_CDN_PROVIDER = 'snapkit';
        process.env.SNAPKIT_ORGANIZATION = 'company-a';

        const nodejsStrategy = environmentStrategies.find(
          (s) => s.name === 'nodejs',
        )!;
        const config1 = getCdnConfig(nodejsStrategy);

        process.env.SNAPKIT_ORGANIZATION = 'company-b';
        const config2 = getCdnConfig(nodejsStrategy);

        process.env.IMAGE_CDN_PROVIDER = 'custom';
        process.env.IMAGE_CDN_URL = 'https://cdn.example.com';
        delete process.env.SNAPKIT_ORGANIZATION;
        const config3 = getCdnConfig(nodejsStrategy);

        // Get builders - each should be cached separately
        const builder1a = UrlBuilderFactory.getInstance(config1);
        const builder1b = UrlBuilderFactory.getInstance(config1); // Should be same instance
        const builder2 = UrlBuilderFactory.getInstance(config2);
        const builder3 = UrlBuilderFactory.getInstance(config3);

        expect(builder1a).toBe(builder1b); // Same config = same instance
        expect(builder1a).not.toBe(builder2); // Different org = different instance
        expect(builder1a).not.toBe(builder3); // Different provider = different instance
        expect(builder2).not.toBe(builder3); // Different configs = different instances

        expect(UrlBuilderFactory.getCacheSize()).toBe(3);

        // Test that they generate correct URLs
        expect(builder1a.buildImageUrl('/test.jpg')).toBe(
          'https://company-a-cdn.snapkit.studio/test.jpg',
        );
        expect(builder2.buildImageUrl('/test.jpg')).toBe(
          'https://company-b-cdn.snapkit.studio/test.jpg',
        );
        expect(builder3.buildImageUrl('/test.jpg')).toBe(
          'https://cdn.example.com/test.jpg',
        );
      });
    });
  });
});
