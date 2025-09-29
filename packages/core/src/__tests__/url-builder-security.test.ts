import { describe, it, expect, beforeEach } from 'vitest';
import { SnapkitUrlBuilder } from '../url-builder';
import type { CdnConfig } from '../types';

describe('SnapkitUrlBuilder Security', () => {
  describe('constructor validation', () => {
    it('should accept valid organization names', () => {
      const config: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org-123',
      };

      expect(() => new SnapkitUrlBuilder(config)).not.toThrow();
    });

    it('should reject invalid organization names', () => {
      const invalidNames = [
        'Test-Org', // Uppercase
        'test_org', // Underscore
        'test.org', // Dot
        'test org', // Space
        'test@org', // Special char
        '../etc', // Path traversal
        '<script>', // XSS attempt
      ];

      for (const name of invalidNames) {
        const config: CdnConfig = {
          provider: 'snapkit',
          organizationName: name,
        };

        expect(() => new SnapkitUrlBuilder(config)).toThrow(
          'organizationName must only contain lowercase letters, numbers, and hyphens'
        );
      }
    });

    it('should validate custom CDN URLs', () => {
      const validUrls = [
        'https://cdn.example.com',
        'http://localhost:3000',
        'https://images.test.io',
      ];

      for (const url of validUrls) {
        const config: CdnConfig = {
          provider: 'custom',
          baseUrl: url,
        };

        expect(() => new SnapkitUrlBuilder(config)).not.toThrow();
      }
    });

    it('should reject malicious custom CDN URLs', () => {
      const maliciousUrls = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd',
        'ftp://malicious.com',
      ];

      for (const url of maliciousUrls) {
        const config: CdnConfig = {
          provider: 'custom',
          baseUrl: url,
        };

        expect(() => new SnapkitUrlBuilder(config)).toThrow('Security validation failed');
      }
    });
  });

  describe('buildImageUrl validation', () => {
    let builder: SnapkitUrlBuilder;

    beforeEach(() => {
      const config: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org',
      };
      builder = new SnapkitUrlBuilder(config);
    });

    it('should accept valid image paths', () => {
      const validPaths = [
        'images/photo.jpg',
        '/images/photo.jpg',
        'gallery/2024/photo.png',
        'assets/logo.svg',
      ];

      for (const path of validPaths) {
        expect(() => builder.buildImageUrl(path)).not.toThrow();
      }
    });

    it('should reject path traversal attempts', () => {
      const maliciousPaths = [
        '../../../etc/passwd',
        'images/../../../etc/passwd',
        '..\\..\\windows\\system32',
        'images/%2e%2e/../../etc/passwd',
      ];

      for (const path of maliciousPaths) {
        expect(() => builder.buildImageUrl(path)).toThrow('Security validation failed');
      }
    });

    it('should validate external URLs', () => {
      const validUrls = [
        'https://example.com/image.jpg',
        'http://cdn.example.com/photo.png',
      ];

      for (const url of validUrls) {
        expect(() => builder.buildImageUrl(url)).not.toThrow();
      }
    });

    it('should reject malicious external URLs', () => {
      // Non-HTTP protocols should be rejected
      expect(() => builder.buildImageUrl('javascript:alert(1)')).toThrow('Security validation failed');
      expect(() => builder.buildImageUrl('data:text/html,<script>alert(1)</script>')).toThrow('Security validation failed');

      // URLs with XSS patterns should be rejected
      expect(() => builder.buildImageUrl('https://example.com/<script>alert(1)</script>')).toThrow('Security validation failed');
    });

    it('should sanitize paths properly', () => {
      // These paths should be sanitized but not throw errors
      const result1 = builder.buildImageUrl('images//photo.jpg');
      expect(result1).toBe('https://test-org-cdn.snapkit.studio/images/photo.jpg');

      const result2 = builder.buildImageUrl('./images/photo.jpg');
      expect(result2).toBe('https://test-org-cdn.snapkit.studio/images/photo.jpg');
    });
  });

  describe('XSS prevention', () => {
    let builder: SnapkitUrlBuilder;

    beforeEach(() => {
      const config: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org',
      };
      builder = new SnapkitUrlBuilder(config);
    });

    it('should prevent XSS in image paths', () => {
      const xssAttempts = [
        'image.jpg<script>alert(1)</script>',
        'image.jpg" onerror="alert(1)',
        'image.jpg\' onload=\'alert(1)',
      ];

      for (const attempt of xssAttempts) {
        const result = builder.buildImageUrl(attempt);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('onerror=');
        expect(result).not.toContain('onload=');
      }
    });

    it('should handle null bytes and control characters', () => {
      // Paths with control characters should be rejected
      expect(() => builder.buildImageUrl('image.jpg\x00.png')).toThrow('Security validation failed');
      expect(() => builder.buildImageUrl('image\x1F.jpg')).toThrow('Security validation failed');
      expect(() => builder.buildImageUrl('image\x7F.jpg')).toThrow('Security validation failed');
    });
  });

  describe('URL building with transforms', () => {
    let builder: SnapkitUrlBuilder;

    beforeEach(() => {
      const config: CdnConfig = {
        provider: 'snapkit',
        organizationName: 'test-org',
      };
      builder = new SnapkitUrlBuilder(config);
    });

    it('should safely handle transforms with malicious paths', () => {
      // Path should be sanitized before transforms are applied
      const result = builder.buildTransformedUrl('./images/photo.jpg', {
        width: 100,
        height: 100,
      });

      expect(result).toBe('https://test-org-cdn.snapkit.studio/images/photo.jpg?w=100&h=100');
    });

    it('should handle srcset generation with security', () => {
      const srcset = builder.buildSrcSet('images/photo.jpg', [100, 200, 300], {
        quality: 80,
      });

      expect(srcset).toContain('https://test-org-cdn.snapkit.studio/images/photo.jpg?w=100&quality=80');
      expect(srcset).toContain('https://test-org-cdn.snapkit.studio/images/photo.jpg?w=200&quality=80');
      expect(srcset).toContain('https://test-org-cdn.snapkit.studio/images/photo.jpg?w=300&quality=80');
    });
  });
});