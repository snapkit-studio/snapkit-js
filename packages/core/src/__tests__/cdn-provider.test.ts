import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environmentStrategies, getCdnConfig } from '../env-config';
import { CdnConfig } from '../types';
import { SnapkitUrlBuilder } from '../url-builder';

describe('CDN Provider Strategy', () => {
  describe('SnapkitUrlBuilder with CDN providers', () => {
    it('should build Snapkit CDN URL with organization name', () => {
      const config: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org',
      };

      const builder = new SnapkitUrlBuilder(config);
      const url = builder.buildImageUrl('/path/to/image.jpg');

      expect(url).toBe('https://test-org-cdn.snapkit.studio/path/to/image.jpg');
    });

    it('should build custom CDN URL with base URL', () => {
      const config: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://cdn.example.com',
      };

      const builder = new SnapkitUrlBuilder(config);
      const url = builder.buildImageUrl('/path/to/image.jpg');

      expect(url).toBe('https://cdn.example.com/path/to/image.jpg');
    });

    it('should build CloudFront URL using custom provider', () => {
      const config: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://d1234567890.cloudfront.net',
      };

      const builder = new SnapkitUrlBuilder(config);
      const url = builder.buildImageUrl('/images/photo.png');

      expect(url).toBe('https://d1234567890.cloudfront.net/images/photo.png');
    });

    it('should build Google Cloud Storage URL using custom provider', () => {
      const config: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://storage.googleapis.com/my-bucket',
      };

      const builder = new SnapkitUrlBuilder(config);
      const url = builder.buildImageUrl('/folder/image.webp');

      expect(url).toBe(
        'https://storage.googleapis.com/my-bucket/folder/image.webp',
      );
    });

    it('should handle URLs without leading slash', () => {
      const config: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://cdn.example.com',
      };

      const builder = new SnapkitUrlBuilder(config);
      const url = builder.buildImageUrl('path/to/image.jpg');

      expect(url).toBe('https://cdn.example.com/path/to/image.jpg');
    });

    it('should return absolute URLs as-is', () => {
      const config: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org',
      };

      const builder = new SnapkitUrlBuilder(config);
      const absoluteUrl = 'https://external.com/image.jpg';
      const url = builder.buildImageUrl(absoluteUrl);

      expect(url).toBe(absoluteUrl);
    });

    it('should throw error when snapkit provider missing organizationName', () => {
      expect(() => {
        const config: CdnConfig = {
          provider: 'snapkit',
          // organizationName 누락
        };
        new SnapkitUrlBuilder(config);
      }).toThrow('organizationName is required when using snapkit provider');
    });

    it('should throw error when custom provider missing baseUrl', () => {
      expect(() => {
        const config: CdnConfig = {
          provider: 'custom',
          // baseUrl 누락
        };
        new SnapkitUrlBuilder(config);
      }).toThrow('baseUrl is required when using custom provider');
    });
  });

  describe('Environment variable configuration', () => {
    // 환경변수 모킹을 위한 원본 값 저장
    const originalEnv = process.env;

    beforeEach(() => {
      // 각 테스트마다 새로운 환경변수 객체 사용
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      // 원본 환경변수 복원
      process.env = originalEnv;
    });

    it('should load snapkit CDN config from environment variables', () => {
      process.env.IMAGE_CDN_PROVIDER = 'snapkit';
      process.env.SNAPKIT_ORGANIZATION = 'my-company';

      const nodejsStrategy = environmentStrategies.find(
        (s) => s.name === 'nodejs',
      )!;
      const config = getCdnConfig(nodejsStrategy);

      expect(config).toEqual({
        provider: 'snapkit',
        organizationName: 'my-company',
      });
    });

    it('should load custom CDN config from environment variables', () => {
      process.env.IMAGE_CDN_PROVIDER = 'custom';
      process.env.IMAGE_CDN_URL = 'https://cdn.mysite.com';
      delete process.env.SNAPKIT_ORGANIZATION; // snapkit이 기본값이므로 제거

      // nodejs strategy 명시적으로 사용
      const nodejsStrategy = environmentStrategies.find(
        (s) => s.name === 'nodejs',
      )!;
      const config = getCdnConfig(nodejsStrategy);

      expect(config).toEqual({
        provider: 'custom',
        baseUrl: 'https://cdn.mysite.com',
      });
    });

    it('should default to snapkit provider when no provider specified', () => {
      process.env.SNAPKIT_ORGANIZATION = 'default-org';
      delete process.env.IMAGE_CDN_PROVIDER;

      const nodejsStrategy = environmentStrategies.find(
        (s) => s.name === 'nodejs',
      )!;
      const config = getCdnConfig(nodejsStrategy);

      expect(config.provider).toBe('snapkit');
      expect(config.organizationName).toBe('default-org');
    });

    it('should throw error when custom provider specified but no URL provided', () => {
      process.env.IMAGE_CDN_PROVIDER = 'custom';
      delete process.env.IMAGE_CDN_URL;
      delete process.env.SNAPKIT_ORGANIZATION; // snapkit 관련 환경변수 제거

      const nodejsStrategy = environmentStrategies.find(
        (s) => s.name === 'nodejs',
      )!;
      expect(() => getCdnConfig(nodejsStrategy)).toThrow(
        'IMAGE_CDN_URL is required when IMAGE_CDN_PROVIDER is "custom"',
      );
    });

    it('should throw error when snapkit provider specified but no organization provided', () => {
      process.env.IMAGE_CDN_PROVIDER = 'snapkit';
      delete process.env.SNAPKIT_ORGANIZATION;

      const nodejsStrategy = environmentStrategies.find(
        (s) => s.name === 'nodejs',
      )!;
      expect(() => getCdnConfig(nodejsStrategy)).toThrow(
        'SNAPKIT_ORGANIZATION is required when IMAGE_CDN_PROVIDER is "snapkit"',
      );
    });

    it('should handle CloudFront configuration from environment', () => {
      process.env.IMAGE_CDN_PROVIDER = 'custom';
      process.env.IMAGE_CDN_URL = 'https://d1234567890.cloudfront.net';
      delete process.env.SNAPKIT_ORGANIZATION; // snapkit 관련 환경변수 제거

      const nodejsStrategy = environmentStrategies.find(
        (s) => s.name === 'nodejs',
      )!;
      const config = getCdnConfig(nodejsStrategy);
      const builder = new SnapkitUrlBuilder(config);
      const url = builder.buildImageUrl('/assets/logo.png');

      expect(url).toBe('https://d1234567890.cloudfront.net/assets/logo.png');
    });
  });
});
