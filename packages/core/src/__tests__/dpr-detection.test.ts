import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getDevicePixelRatio,
  getNetworkAwareDprLimit,
  getOptimalDprValues,
  shouldUse3xImages,
  supportsHighEfficiencyFormats,
} from '../dpr-detection';

describe('DPR Detection', () => {
  let originalWindow: typeof globalThis.window;
  let originalNavigator: typeof globalThis.navigator;

  beforeEach(() => {
    // Save original values
    originalWindow = global.window;
    originalNavigator = global.navigator;
  });

  afterEach(() => {
    // Restore original values
    global.window = originalWindow;
    if (originalNavigator) {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
        configurable: true,
      });
    }
  });

  describe('getDevicePixelRatio', () => {
    it('should return 1 in SSR/Node.js environment', () => {
      // @ts-expect-error - Intentionally deleting global.window for SSR testing
      delete global.window;
      expect(getDevicePixelRatio()).toBe(1);
    });

    it('should return device pixel ratio when available', () => {
      global.window = { devicePixelRatio: 2 } as any;
      expect(getDevicePixelRatio()).toBe(2);
    });

    it('should return 1 when devicePixelRatio is not available', () => {
      global.window = {} as any;
      expect(getDevicePixelRatio()).toBe(1);
    });
  });

  describe('getOptimalDprValues', () => {
    beforeEach(() => {
      global.window = {} as any;
    });

    it('should use forced DPR when provided', () => {
      const result = getOptimalDprValues({ forceDpr: 2 });
      expect(result).toEqual([2]);
    });

    it('should use custom DPRs when provided', () => {
      const result = getOptimalDprValues({ customDprs: [1, 1.5, 2] });
      expect(result).toEqual([1, 1.5, 2]);
    });

    it('should filter custom DPRs by maxDpr', () => {
      const result = getOptimalDprValues({
        customDprs: [1, 2, 3, 4],
        maxDpr: 2,
      });
      expect(result).toEqual([1, 2]);
    });

    it('should return standard set when autoDetect is false', () => {
      const result = getOptimalDprValues({ autoDetect: false });
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return [1] for standard displays (DPR <= 1)', () => {
      global.window = { devicePixelRatio: 1 } as any;
      const result = getOptimalDprValues();
      expect(result).toEqual([1]);
    });

    it('should return [1, 1.5] for scaled desktop displays (DPR <= 1.5)', () => {
      global.window = { devicePixelRatio: 1.5 } as any;
      const result = getOptimalDprValues();
      expect(result).toEqual([1, 1.5]);
    });

    it('should return [1, 2] for Retina displays (DPR <= 2)', () => {
      global.window = { devicePixelRatio: 2 } as any;
      const result = getOptimalDprValues();
      expect(result).toEqual([1, 2]);
    });

    it('should return [1, 2] for high-DPI mobile (DPR = 2.5)', () => {
      global.window = { devicePixelRatio: 2.5 } as any;
      const result = getOptimalDprValues();
      expect(result).toEqual([1, 2]);
    });

    it('should return [1, 2, 3] for ultra high-DPI devices (DPR >= 3)', () => {
      global.window = { devicePixelRatio: 3 } as any;
      const result = getOptimalDprValues();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should respect maxDpr setting', () => {
      global.window = { devicePixelRatio: 3 } as any;
      const result = getOptimalDprValues({ maxDpr: 2 });
      expect(result).toEqual([1, 2]);
    });
  });

  describe('supportsHighEfficiencyFormats', () => {
    it('should return default values in SSR environment', () => {
      // @ts-expect-error - Intentionally deleting global.window for SSR testing
      delete global.window;
      const result = supportsHighEfficiencyFormats();
      expect(result).toEqual({ avif: false, webp: true });
    });

    it('should detect format support in browser', () => {
      const mockCanvas = {
        width: 0,
        height: 0,
        toDataURL: vi.fn((format: string) => {
          if (format === 'image/webp') return 'data:image/webp;base64,';
          if (format === 'image/avif') return 'data:image/avif;base64,';
          return 'data:image/png;base64,';
        }),
      };

      global.window = {} as any;
      global.document = {
        createElement: vi.fn(() => mockCanvas),
      } as any;

      const result = supportsHighEfficiencyFormats();
      expect(result.webp).toBe(true);
      expect(result.avif).toBe(true);
    });
  });

  describe('getNetworkAwareDprLimit', () => {
    it('should return 3 in SSR environment', () => {
      // @ts-expect-error - Intentionally deleting global.window for SSR testing
      delete global.window;
      expect(getNetworkAwareDprLimit()).toBe(3);
    });

    it('should return 1 when data saver is enabled', () => {
      global.window = {} as any;
      global.navigator = {
        connection: {
          saveData: true,
          effectiveType: '4g',
        },
      } as any;
      expect(getNetworkAwareDprLimit()).toBe(1);
    });

    it('should return appropriate limit based on connection type', () => {
      global.window = {} as any;

      // Test slow-2g
      global.navigator = {
        connection: { effectiveType: 'slow-2g', saveData: false },
      } as any;
      expect(getNetworkAwareDprLimit()).toBe(1);

      // Test 2g
      global.navigator = {
        connection: { effectiveType: '2g', saveData: false },
      } as any;
      expect(getNetworkAwareDprLimit()).toBe(1);

      // Test 3g
      global.navigator = {
        connection: { effectiveType: '3g', saveData: false },
      } as any;
      expect(getNetworkAwareDprLimit()).toBe(2);

      // Test 4g
      global.navigator = {
        connection: { effectiveType: '4g', saveData: false },
      } as any;
      expect(getNetworkAwareDprLimit()).toBe(3);
    });
  });

  describe('shouldUse3xImages', () => {
    beforeEach(() => {
      global.window = {} as any;
      global.navigator = {} as any;
    });

    it('should return false for low DPR devices', () => {
      global.window = { devicePixelRatio: 2 } as any;
      expect(shouldUse3xImages()).toBe(false);
    });

    it('should return false when network is slow', () => {
      global.window = { devicePixelRatio: 3 } as any;
      global.navigator = {
        connection: { effectiveType: '3g', saveData: false },
      } as any;
      expect(shouldUse3xImages()).toBe(false);
    });

    it('should return false when maxDpr is less than 3', () => {
      global.window = { devicePixelRatio: 3 } as any;
      global.navigator = {
        connection: { effectiveType: '4g', saveData: false },
      } as any;
      expect(shouldUse3xImages({ maxDpr: 2 })).toBe(false);
    });

    it('should return false when AVIF is supported', () => {
      global.window = { devicePixelRatio: 3 } as any;
      global.navigator = {
        connection: { effectiveType: '4g', saveData: false },
      } as any;

      const mockCanvas = {
        width: 0,
        height: 0,
        toDataURL: vi.fn((format: string) => {
          if (format === 'image/avif') return 'data:image/avif;base64,';
          return 'data:image/png;base64,';
        }),
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas),
      } as any;

      expect(shouldUse3xImages()).toBe(false);
    });

    it('should return true when all conditions are met', () => {
      global.window = { devicePixelRatio: 3 } as any;
      global.navigator = {
        connection: { effectiveType: '4g', saveData: false },
      } as any;

      const mockCanvas = {
        width: 0,
        height: 0,
        toDataURL: vi.fn(() => 'data:image/png;base64,'),
      };

      global.document = {
        createElement: vi.fn(() => mockCanvas),
      } as any;

      expect(shouldUse3xImages()).toBe(true);
    });
  });
});
