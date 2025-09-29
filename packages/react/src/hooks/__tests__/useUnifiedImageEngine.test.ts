import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useImageConfig,
  useUnifiedImageEngine,
} from '../useUnifiedImageEngine';

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
        quality: params.quality || config.defaultQuality,
        format: config.defaultFormat,
      },
      adjustedQuality: params.quality || config.defaultQuality,
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

  describe('useImageConfig compatibility', () => {
    it('should provide backward compatible interface', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
        height: 600,
      };

      const { result } = renderHook(() => useImageConfig(props));

      expect(result.current).toMatchObject({
        imageUrl: expect.stringContaining('/test.jpg'),
        srcSet: expect.any(String),
        imageSize: {
          width: 800,
          height: 600,
        },
        finalTransforms: expect.any(Object),
        adjustedQuality: expect.any(Number),
      });
    });

    it('should return undefined for deprecated properties', () => {
      const props = {
        src: '/test.jpg',
        width: 800,
      };

      const { result } = renderHook(() => useImageConfig(props));

      expect(result.current.urlBuilder).toBeUndefined();
      expect(result.current.config).toBeUndefined();
    });
  });
});
