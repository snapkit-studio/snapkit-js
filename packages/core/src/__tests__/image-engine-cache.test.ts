import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SnapkitImageEngine } from '../image-engine';
import { ImageEngineCache } from '../image-engine-cache';
import type { SnapkitConfig } from '../types';

// Mock the SnapkitImageEngine
vi.mock('../image-engine', () => ({
  SnapkitImageEngine: vi.fn().mockImplementation((config) => ({
    config,
    id: Math.random(), // Each instance gets a unique ID for testing
  })),
}));

describe('ImageEngineCache', () => {
  const mockConfig: SnapkitConfig = {
    cdnConfig: {
      provider: 'snapkit',
      organizationName: 'test-org',
    },
    defaultQuality: 80,
    defaultFormat: 'auto',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the cache
    ImageEngineCache.clearCache();
  });

  describe('getInstance', () => {
    it('Should create new instance on first call', () => {
      const engine = ImageEngineCache.getInstance(mockConfig);

      expect(engine).toBeDefined();
      expect(SnapkitImageEngine).toHaveBeenCalledWith(mockConfig);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);
    });

    it('Should return cached instance for same config', () => {
      const engine1 = ImageEngineCache.getInstance(mockConfig);
      const engine2 = ImageEngineCache.getInstance(mockConfig);

      expect(engine1).toBe(engine2);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);
    });

    it('Should create different instances for different configurations', () => {
      const config1: SnapkitConfig = {
        ...mockConfig,
        cdnConfig: { ...mockConfig.cdnConfig, organizationName: 'org1' },
      };
      const config2: SnapkitConfig = {
        ...mockConfig,
        cdnConfig: { ...mockConfig.cdnConfig, organizationName: 'org2' },
      };

      const engine1 = ImageEngineCache.getInstance(config1);
      const engine2 = ImageEngineCache.getInstance(config2);

      expect(engine1).not.toBe(engine2);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearCache', () => {
    it('Should clear all cached instances', () => {
      ImageEngineCache.getInstance(mockConfig);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(1);

      ImageEngineCache.clearCache();

      // Should create new instance after clear
      ImageEngineCache.getInstance(mockConfig);
      expect(SnapkitImageEngine).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCacheSize', () => {
    it('Should return 0 for empty cache', () => {
      expect(ImageEngineCache.getCacheSize()).toBe(0);
    });

    it('Should return correct cache size', () => {
      ImageEngineCache.getInstance(mockConfig);
      expect(ImageEngineCache.getCacheSize()).toBe(1);

      const config2: SnapkitConfig = {
        ...mockConfig,
        cdnConfig: { ...mockConfig.cdnConfig, organizationName: 'org2' },
      };
      ImageEngineCache.getInstance(config2);
      expect(ImageEngineCache.getCacheSize()).toBe(2);
    });
  });
});
