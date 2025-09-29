import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCdnConfig } from '../env-config';

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

  describe('getCdnConfig', () => {
    it('should return snapkit config when snapkit environment is set', () => {
      process.env.SNAPKIT_ORGANIZATION = 'env-org';

      const result = getCdnConfig();

      expect(result).toEqual({
        provider: 'snapkit',
        organizationName: 'env-org',
      });
    });

    it('should return custom config when custom CDN environment is set', () => {
      process.env.IMAGE_CDN_PROVIDER = 'custom';
      process.env.IMAGE_CDN_URL = 'https://custom.cdn.example.com';

      const result = getCdnConfig();

      expect(result).toEqual({
        provider: 'custom',
        baseUrl: 'https://custom.cdn.example.com',
      });
    });

    it('should use default organization when no environment variables are set', () => {
      delete process.env.SNAPKIT_ORGANIZATION;
      delete process.env.SNAPKIT_ORGANIZATION_NAME;
      delete process.env.IMAGE_CDN_PROVIDER;

      const result = getCdnConfig();

      expect(result).toEqual({
        provider: 'snapkit',
        organizationName: 'test-org', // default from mock
      });
    });
  });
});
