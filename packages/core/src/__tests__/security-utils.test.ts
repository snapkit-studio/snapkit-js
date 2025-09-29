import { describe, it, expect } from 'vitest';
import {
  isValidUrl,
  isValidPath,
  sanitizePath,
  createSecurityError,
} from '../security-utils';

describe('Security Utils', () => {
  describe('isValidUrl', () => {
    it('should accept valid URLs', () => {
      expect(isValidUrl('https://example.com/image.jpg')).toBe(true);
      expect(isValidUrl('http://cdn.example.com/path/to/image.png')).toBe(true);
      expect(isValidUrl('https://cdn.test.io:8080/images/test.webp')).toBe(true);
    });

    it('should reject malicious URLs', () => {
      expect(isValidUrl('javascript:alert("XSS")')).toBe(false);
      expect(isValidUrl('data:text/html,<script>alert("XSS")</script>')).toBe(false);
      expect(isValidUrl('vbscript:msgbox("XSS")')).toBe(false);
      expect(isValidUrl('file:///etc/passwd')).toBe(false);
      expect(isValidUrl('ftp://malicious.com/file')).toBe(false);
    });

    it('should reject URLs with XSS patterns', () => {
      expect(isValidUrl('https://example.com/<script>alert("XSS")</script>')).toBe(false);
      expect(isValidUrl('https://example.com/image.jpg?onclick=alert("XSS")')).toBe(false);
      expect(isValidUrl('https://example.com/image.jpg#<img src=x onerror=alert(1)>')).toBe(false);
    });

    it('should reject URLs with control characters', () => {
      expect(isValidUrl('https://example.com/image\x00.jpg')).toBe(false);
      expect(isValidUrl('https://example.com/image\x1F.jpg')).toBe(false);
      expect(isValidUrl('https://example.com/image\x7F.jpg')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('//example.com/image.jpg')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isValidPath', () => {
    it('should accept valid paths', () => {
      expect(isValidPath('/images/photo.jpg')).toBe(true);
      expect(isValidPath('images/gallery/photo.png')).toBe(true);
      expect(isValidPath('/assets/images/logo.svg')).toBe(true);
      expect(isValidPath('photo-123.jpg')).toBe(true);
    });

    it('should reject path traversal attempts', () => {
      expect(isValidPath('../../../etc/passwd')).toBe(false);
      expect(isValidPath('images/../../../etc/passwd')).toBe(false);
      expect(isValidPath('..\\..\\windows\\system32')).toBe(false);
      expect(isValidPath('images/%2e%2e/../../etc/passwd')).toBe(false);
      expect(isValidPath('images/..%2f..%2fetc/passwd')).toBe(false);
      expect(isValidPath('%252e%252e/etc/passwd')).toBe(false);
    });

    it('should reject paths with null bytes', () => {
      expect(isValidPath('image.jpg\x00.png')).toBe(false);
      expect(isValidPath('/images/photo\0.jpg')).toBe(false);
    });

    it('should reject absolute system paths', () => {
      expect(isValidPath('/etc/passwd')).toBe(false);
      expect(isValidPath('/usr/bin/ls')).toBe(false);
      expect(isValidPath('C:\\Windows\\System32')).toBe(false);
      expect(isValidPath('D:\\sensitive\\data')).toBe(false);
    });
  });

  describe('sanitizePath', () => {
    it('should sanitize valid paths', () => {
      expect(sanitizePath('/images/photo.jpg')).toBe('/images/photo.jpg');
      expect(sanitizePath('images/photo.jpg')).toBe('/images/photo.jpg');
      expect(sanitizePath('/assets/images/logo.svg')).toBe('/assets/images/logo.svg');
    });

    it('should remove directory traversal attempts', () => {
      expect(sanitizePath('../../../etc/passwd')).toBe('/etc/passwd');
      expect(sanitizePath('images/../../../etc/passwd')).toBe('/images/etc/passwd');
      expect(sanitizePath('/images/../photos/image.jpg')).toBe('/images/photos/image.jpg');
    });

    it('should normalize multiple slashes', () => {
      expect(sanitizePath('//images///photo.jpg')).toBe('/images/photo.jpg');
      expect(sanitizePath('/images////gallery//photo.jpg')).toBe('/images/gallery/photo.jpg');
    });

    it('should remove null bytes and control characters', () => {
      expect(sanitizePath('image.jpg\x00.png')).toBe('/image.jpg.png');
      expect(sanitizePath('/images/photo\x1F.jpg')).toBe('/images/photo.jpg');
    });

    it('should remove invalid path characters', () => {
      expect(sanitizePath('image<script>.jpg')).toBe('/imagescript.jpg');
      expect(sanitizePath('photo:test.jpg')).toBe('/phototest.jpg');
      expect(sanitizePath('file|name.jpg')).toBe('/filename.jpg');
    });

    it('should handle empty segments', () => {
      expect(sanitizePath('/images/./photo.jpg')).toBe('/images/photo.jpg');
      expect(sanitizePath('./images/./photo.jpg')).toBe('/images/photo.jpg');
    });
  });

  describe('createSecurityError', () => {
    it('should create security error with context', () => {
      const error = createSecurityError('URL validation', 'javascript:alert(1)', 'XSS attempt detected');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('SecurityValidationError');
      expect(error.message).toContain('URL validation');
      expect(error.message).toContain('XSS attempt detected');
      expect(error.message).toContain('javascript:alert(1)');
    });

    it('should truncate long input in error message', () => {
      const longInput = 'a'.repeat(150);
      const error = createSecurityError('path validation', longInput, 'Invalid path');

      expect(error.message).toContain('a'.repeat(100) + '...');
      expect(error.message).not.toContain('a'.repeat(101));
    });
  });
});