import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CdnConfig } from '../types';
import { SnapkitUrlBuilder } from '../url-builder';
import { UrlBuilderFactory } from '../url-builder-factory';

// Mock the SnapkitUrlBuilder
vi.mock('../url-builder', () => ({
  SnapkitUrlBuilder: vi.fn().mockImplementation((config) => ({
    config,
    id: Math.random(), // Each instance gets a unique ID for testing
  })),
}));

describe('UrlBuilderFactory', () => {
  const snapkitConfig: CdnConfig = {
    provider: 'snapkit',
    organizationName: 'test-org',
  };

  const customConfig: CdnConfig = {
    provider: 'custom',
    baseUrl: 'https://cdn.example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the cache before each test
    UrlBuilderFactory.clearCache();
  });

  describe('getInstance', () => {
    it('Should create a new instance for the first request', () => {
      const builder = UrlBuilderFactory.getInstance(snapkitConfig);

      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith(snapkitConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);
    });

    it('Should return cached instance for the same configuration', () => {
      const builder1 = UrlBuilderFactory.getInstance(snapkitConfig);
      const builder2 = UrlBuilderFactory.getInstance(snapkitConfig);

      expect(builder1).toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(1);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);
    });

    it('Should create different instances for different CDN providers', () => {
      const snapkitBuilder = UrlBuilderFactory.getInstance(snapkitConfig);
      const customBuilder = UrlBuilderFactory.getInstance(customConfig);

      expect(snapkitBuilder).not.toBe(customBuilder);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
      expect(SnapkitUrlBuilder).toHaveBeenNthCalledWith(1, snapkitConfig);
      expect(SnapkitUrlBuilder).toHaveBeenNthCalledWith(2, customConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });

    it('Should create different instances for different organizations', () => {
      const config1: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org-1',
      };

      const config2: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org-2',
      };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);

      expect(builder1).not.toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });

    it('Should create different instances for different custom URLs', () => {
      const config1: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://cdn1.example.com',
      };

      const config2: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://cdn2.example.com',
      };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);

      expect(builder1).not.toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });
  });

  describe('clearCache', () => {
    it('Should clear all cached instances', () => {
      UrlBuilderFactory.getInstance(snapkitConfig);
      UrlBuilderFactory.getInstance(customConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);

      UrlBuilderFactory.clearCache();
      expect(UrlBuilderFactory.getCacheSize()).toBe(0);
    });

    it('Should allow creating new instances after cache clear', () => {
      const builder1 = UrlBuilderFactory.getInstance(snapkitConfig);
      UrlBuilderFactory.clearCache();
      const builder2 = UrlBuilderFactory.getInstance(snapkitConfig);

      expect(builder1).not.toBe(builder2);
      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCacheSize', () => {
    it('Should return 0 when cache is empty', () => {
      expect(UrlBuilderFactory.getCacheSize()).toBe(0);
    });

    it('Should return correct cache size', () => {
      UrlBuilderFactory.getInstance(snapkitConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);

      UrlBuilderFactory.getInstance(customConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });

    it('Should not increase size for duplicate configurations', () => {
      UrlBuilderFactory.getInstance(snapkitConfig);
      UrlBuilderFactory.getInstance(snapkitConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);
    });

    it('Should decrease after cache clear', () => {
      UrlBuilderFactory.getInstance(snapkitConfig);
      UrlBuilderFactory.getInstance(customConfig);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);

      UrlBuilderFactory.clearCache();
      expect(UrlBuilderFactory.getCacheSize()).toBe(0);
    });
  });

  describe('createKey', () => {
    it('Should create different keys for different CDN providers', () => {
      const builder1 = UrlBuilderFactory.getInstance(snapkitConfig);
      const builder2 = UrlBuilderFactory.getInstance(customConfig);

      expect(builder1).not.toBe(builder2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });

    it('Should create same key for same configuration', () => {
      const builder1 = UrlBuilderFactory.getInstance(snapkitConfig);
      const builder2 = UrlBuilderFactory.getInstance(snapkitConfig);

      expect(builder1).toBe(builder2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);
    });
  });

  describe('Edge cases', () => {
    it('Should handle rapid successive calls for same configuration', () => {
      const builders: any[] = [];
      for (let i = 0; i < 10; i++) {
        builders.push(UrlBuilderFactory.getInstance(snapkitConfig));
      }

      // All should be the same instance
      builders.forEach((builder) => {
        expect(builder).toBe(builders[0]);
      });

      expect(SnapkitUrlBuilder).toHaveBeenCalledTimes(1);
      expect(UrlBuilderFactory.getCacheSize()).toBe(1);
    });

    it('Should handle special characters in organization name', () => {
      const specialConfig: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org-with-special-chars@#$',
      };

      const builder = UrlBuilderFactory.getInstance(specialConfig);
      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith(specialConfig);
    });

    it('Should handle special characters in custom URLs', () => {
      const specialConfig: CdnConfig = {
        provider: 'custom',
        baseUrl: 'https://cdn.example.com/path-with-special-chars@#$',
      };

      const builder = UrlBuilderFactory.getInstance(specialConfig);
      expect(builder).toBeDefined();
      expect(SnapkitUrlBuilder).toHaveBeenCalledWith(specialConfig);
    });

    it('Should maintain separate caches for case-sensitive configurations', () => {
      const config1: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'Test-Org',
      };

      const config2: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org',
      };

      const builder1 = UrlBuilderFactory.getInstance(config1);
      const builder2 = UrlBuilderFactory.getInstance(config2);

      expect(builder1).not.toBe(builder2);
      expect(UrlBuilderFactory.getCacheSize()).toBe(2);
    });
  });
});
