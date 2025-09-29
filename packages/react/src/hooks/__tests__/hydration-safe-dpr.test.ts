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
});
