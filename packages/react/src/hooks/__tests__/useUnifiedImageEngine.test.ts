import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUnifiedImageEngine } from '../useUnifiedImageEngine';

// Mock the core module
vi.mock('@snapkit-studio/core', () => ({
  getCdnConfig: vi.fn(() => ({
    provider: 'snapkit' as const,
    organizationName: 'test-org',
  })),
  SnapkitImageEngine: vi.fn().mockImplementation((config) => ({
    generateImageData: vi.fn((params) => ({
      url: `${params.src}?q=${config.defaultQuality}`,
      srcSet: `${params.src}?w=400 1x, ${params.src}?w=800 2x`,
      size: {
        width: params.width || 400,
        height: params.height,
      },
      transforms: {
        width: params.width,
        height: params.height,
        quality: params.quality !== undefined ? params.quality : config.defaultQuality,
        format: config.defaultFormat,
      },
      adjustedQuality: params.quality !== undefined ? params.quality : config.defaultQuality,
    })),
    getConfig: vi.fn(() => config),
  })),
}));

// Mock env config
vi.mock('../../utils/env-config', () => ({
  mergeConfigWithEnv: vi.fn((props) => ({
    cdnConfig: {
      provider: 'snapkit' as const,
      organizationName: props?.organizationName || 'test-org',
    },
    defaultQuality: props?.defaultQuality || 85,
    defaultFormat: props?.defaultFormat || 'auto',
  })),
}));

describe('useUnifiedImageEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic usage', () => {
    it('should generate image data with required props', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        height: 600,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current).toMatchObject({
        url: expect.stringContaining('/test.jpg'),
        srcSet: expect.any(String),
        size: {
          width: 800,
          height: 600,
        },
      });
    });

    it('should use default quality when not specified', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.transforms.quality).toBe(85);
      expect(result.current.adjustedQuality).toBe(85);
    });

    it('should override quality when specified', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        quality: 90,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.transforms.quality).toBe(90);
      expect(result.current.adjustedQuality).toBe(90);
    });

    it('should handle fill mode', () => {
      const props = {
        src: '/test.jpg',
        fill: true,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.size.width).toBe(400); // Default from mock
    });

    it('should include transforms in the result', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        transforms: {
          blur: 10,
          grayscale: true,
        },
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.transforms).toBeDefined();
    });

    it('should handle sizes prop', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        sizes: '(max-width: 768px) 100vw, 50vw',
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.srcSet).toBeDefined();
    });

    it('should use CDN configuration from environment', async () => {
      const { getCdnConfig } = vi.mocked(await import('@snapkit-studio/core'));

      const props = {
        src: '/test.jpg',
        width: 800,
      };

      renderHook(() => useUnifiedImageEngine(props));

      expect(getCdnConfig).toHaveBeenCalled();
    });

    it('should use custom default format', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        defaultFormat: 'webp' as const,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.transforms.format).toBe('webp');
    });
  });

  describe('Dynamic Quality behavior', () => {
    it('should preserve user-specified quality when adjustQualityByNetwork is not specified', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        quality: 60, // Specific quality that should be preserved
        // adjustQualityByNetwork is undefined - should default to false
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.transforms.quality).toBe(60);
      expect(result.current.adjustedQuality).toBe(60);
    });

    it('should preserve user-specified quality when adjustQualityByNetwork is explicitly false', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        quality: 100,
        adjustQualityByNetwork: false,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      expect(result.current.transforms.quality).toBe(100);
      expect(result.current.adjustedQuality).toBe(100);
    });

    it('should apply network adjustment when adjustQualityByNetwork is explicitly true', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        quality: 95,
        adjustQualityByNetwork: true,
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      // Note: The exact adjusted value depends on network conditions,
      // but the hook should respect the adjustQualityByNetwork setting
      expect(result.current.transforms.quality).toBeDefined();
      expect(result.current.adjustedQuality).toBeDefined();
    });

    it('should use config defaultQuality when quality param not specified and no network adjustment', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        // quality is undefined
        // adjustQualityByNetwork is undefined - should default to false
      };

      const { result } = renderHook(() => useUnifiedImageEngine(props));

      // Should use config.defaultQuality (85 from mock) without network adjustment
      expect(result.current.transforms.quality).toBe(85);
      expect(result.current.adjustedQuality).toBe(85);
    });

    it('should handle Dynamic Quality edge cases', () => {
      // Test case 1: quality = 0 (edge case)
      const propsZero = {
        src: '/test.jpg',
        width: 800,
        quality: 0,
      };

      const { result: resultZero } = renderHook(() => useUnifiedImageEngine(propsZero));
      expect(resultZero.current.transforms.quality).toBe(0);

      // Test case 2: very high quality
      const propsHigh = {
        src: '/test.jpg',
        width: 800,
        quality: 100,
      };

      const { result: resultHigh } = renderHook(() => useUnifiedImageEngine(propsHigh));
      expect(resultHigh.current.transforms.quality).toBe(100);
    });
  });

});
