import { beforeEach, describe, expect, it } from 'vitest';

import { ImageEngineParams, SnapkitImageEngine } from '../image-engine';
import { SnapkitConfig } from '../types';

describe('SnapkitImageEngine', () => {
  let config: SnapkitConfig;
  let engine: SnapkitImageEngine;

  beforeEach(() => {
    config = {
      cdnConfig: {
        provider: 'snapkit',
        organizationName: 'test-org',
      },
      defaultQuality: 80,
      defaultFormat: 'auto',
    };
    engine = new SnapkitImageEngine(config);
  });

  describe('constructor', () => {
    it('should create engine with valid config', () => {
      expect(engine).toBeInstanceOf(SnapkitImageEngine);
      expect(engine.getConfig()).toEqual(config);
    });

    it('should throw error with invalid organizationName', () => {
      const invalidConfig: SnapkitConfig = {
        ...config,
        cdnConfig: {
          provider: 'snapkit',
          organizationName: '',
        },
      };

      expect(() => {
        new SnapkitImageEngine(invalidConfig);
      }).toThrow('organizationName is required');
    });

    it('should throw error with invalid quality', () => {
      expect(() => {
        new SnapkitImageEngine({ ...config, defaultQuality: 150 });
      }).toThrow('defaultQuality must be a number between 1 and 100');
    });

    it('should throw error with invalid format', () => {
      expect(() => {
        new SnapkitImageEngine({ ...config, defaultFormat: 'invalid' as any });
      }).toThrow('defaultFormat must be one of:');
    });
  });

  describe('validateParams', () => {
    it('should validate valid parameters', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        height: 600,
        quality: 85,
      };

      const result = engine.validateParams(params);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid src', () => {
      const params: ImageEngineParams = {
        src: '',
        width: 800,
      };

      const result = engine.validateParams(params);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('src must be a non-empty string');
    });

    it('should reject invalid width', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: -100,
      };

      const result = engine.validateParams(params);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('width must be a positive number');
    });

    it('should reject invalid quality', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        quality: 150,
      };

      const result = engine.validateParams(params);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'quality must be a number between 1 and 100',
      );
    });
  });

  describe('generateImageData', () => {
    it('should generate basic image data', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        height: 600,
      };

      const result = engine.generateImageData(params);

      expect(result.url).toBeDefined();
      expect(result.url).toContain('test.jpg');
      expect(result.size).toEqual({ width: 800, height: 600 });
      expect(result.transforms.width).toBe(800);
      expect(result.transforms.height).toBe(600);
      expect(result.adjustedQuality).toBeGreaterThan(0);
    });

    it('should generate srcSet for normal images', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        height: 600,
      };

      const result = engine.generateImageData(params);

      expect(result.srcSet).toBeDefined();
      expect(result.srcSet).toContain('test.jpg');
      // Should contain DPR-based srcset
      expect(result.srcSet).toMatch(/\s1x/);
    });

    it('should handle fill mode correctly', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        fill: true,
      };

      const result = engine.generateImageData(params);

      expect(result.size.width).toBe(1920); // Default fill width
      expect(result.size.height).toBeUndefined();
      expect(result.srcSet).toBeDefined();
    });

    it('should handle sizes prop', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        sizes: '(max-width: 768px) 100vw, 50vw',
      };

      const result = engine.generateImageData(params);

      expect(result.srcSet).toBeDefined();
      expect(result.srcSet).toContain('w'); // Should contain width descriptors
    });

    it('should apply quality adjustment', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        adjustQualityByNetwork: true,
      };

      const result = engine.generateImageData(params);

      expect(result.adjustedQuality).toBeDefined();
      expect(result.transforms.quality).toBe(result.adjustedQuality);
    });

    it('should disable quality adjustment when specified', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        quality: 90,
        adjustQualityByNetwork: false,
      };

      const result = engine.generateImageData(params);

      expect(result.adjustedQuality).toBe(90);
      expect(result.transforms.quality).toBe(90);
    });
  });

  describe('createNextJsLoader', () => {
    it('should create compatible Next.js loader', () => {
      const loader = engine.createNextJsLoader();

      expect(typeof loader).toBe('function');

      const result = loader({
        src: 'test.jpg',
        width: 800,
        quality: 85,
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('test.jpg');
    });

    it('should handle loader without optional params', () => {
      const loader = engine.createNextJsLoader();

      const result = loader({
        src: 'test.jpg',
      });

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('integration with transforms', () => {
    it('should apply custom transforms', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        transforms: {
          format: 'webp',
          quality: 90,
          blur: 5,
        },
      };

      const result = engine.generateImageData(params);

      expect(result.transforms.format).toBe('webp');
      expect(result.transforms.blur).toBe(5);
    });

    it('should merge config defaults with custom transforms', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        transforms: {
          blur: 3,
        },
      };

      const result = engine.generateImageData(params);

      expect(result.transforms.format).toBe(config.defaultFormat);
      expect(result.transforms.blur).toBe(3);
    });

    it('should handle sizes with parsing failure fallback', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        sizes: 'invalid-sizes-string',
      };

      const result = engine.generateImageData(params);

      expect(result.srcSet).toBeDefined();
      expect(result.srcSet).toContain('800w');
    });

    it('should handle non-finite height validation', () => {
      const params: ImageEngineParams = {
        src: 'test.jpg',
        width: 800,
        height: Infinity,
      };

      const validation = engine.validateParams(params);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('height must be a positive number');
    });
  });
});
