import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mergeConfigWithEnv } from '../env-config';

// Mock the core module first
vi.mock('@snapkit-studio/core', async () => {
  const actual = await vi.importActual('@snapkit-studio/core');
  return {
    ...actual,
    getCdnConfig: vi.fn(() => {
      const env = process.env;

      // Mock CDN configuration based on environment variables or defaults
      if (env.IMAGE_CDN_PROVIDER === 'custom') {
        return {
          provider: 'custom' as const,
          baseUrl: env.IMAGE_CDN_URL || 'https://example.com/cdn',
        };
      }

      // Default to snapkit provider
      return {
        provider: 'snapkit' as const,
        organizationName: env.SNAPKIT_ORGANIZATION || env.SNAPKIT_ORGANIZATION_NAME || 'test-org',
      };
    }),
  };
});

describe('env-config utilities', () => {
  const originalProcessEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env
    process.env = { ...originalProcessEnv };
  });

  afterEach(() => {
    process.env = originalProcessEnv;
  });

  describe('mergeConfigWithEnv', () => {
    it('should prioritize props over environment variables', () => {
      process.env.SNAPKIT_ORGANIZATION = 'env-org';

      const propsConfig = {
        defaultQuality: 90,
        defaultFormat: 'avif' as const,
      };

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        cdnConfig: {
          provider: 'snapkit',
          organizationName: 'env-org',
        },
        defaultQuality: 90,
        defaultFormat: 'avif',
      });
    });

    it('should fall back to environment variables when props are not provided', () => {
      process.env.SNAPKIT_ORGANIZATION = 'env-org';

      const propsConfig = {};

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        cdnConfig: {
          provider: 'snapkit',
          organizationName: 'env-org',
        },
        defaultQuality: 85,
        defaultFormat: 'auto',
      });
    });

    it('should use default values when neither props nor env are provided', () => {
      delete process.env.SNAPKIT_ORGANIZATION;
      delete process.env.SNAPKIT_ORGANIZATION_NAME;

      const propsConfig = {};
      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        cdnConfig: {
          provider: 'snapkit',
          organizationName: 'test-org', // default from mock
        },
        defaultQuality: 85,
        defaultFormat: 'auto',
      });
    });

    it('should merge partial props with environment defaults', () => {
      process.env.SNAPKIT_ORGANIZATION = 'env-org';

      const propsConfig = {
        defaultQuality: 90,
      };

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        cdnConfig: {
          provider: 'snapkit',
          organizationName: 'env-org',
        },
        defaultQuality: 90,
        defaultFormat: 'auto',
      });
    });

    it('should use built-in defaults when no config is provided', () => {
      process.env.SNAPKIT_ORGANIZATION = 'test-org';

      const propsConfig = {};

      const result = mergeConfigWithEnv(propsConfig);

      expect(result).toEqual({
        cdnConfig: {
          provider: 'snapkit',
          organizationName: 'test-org',
        },
        defaultQuality: 85,
        defaultFormat: 'auto',
      });
    });
  });
});
