/**
 * Security utilities for URL and path validation
 */

/**
 * Validates if a URL is safe to use
 * Prevents common security issues like XSS and SSRF attacks
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Prevent javascript: protocol and data: URIs
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return false;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /[\x00-\x1F\x7F]/,  // Control characters
      /<script/i,         // Script tags
      /on\w+\s*=/i,       // Event handlers
      /javascript:/i,     // JavaScript protocol
      /vbscript:/i,       // VBScript protocol
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitizes file paths to prevent directory traversal attacks
 */
export function sanitizePath(path: string): string {
  // Remove null bytes
  let sanitized = path.replace(/\0/g, '');

  // Normalize multiple slashes
  sanitized = sanitized.replace(/\/+/g, '/');

  // Remove relative path components
  const segments = sanitized.split('/');
  const result: string[] = [];

  for (const segment of segments) {
    if (segment === '..') {
      // Prevent directory traversal
      continue;
    }
    if (segment === '.' || segment === '') {
      // Skip current directory references and empty segments
      continue;
    }
    // Remove any remaining suspicious patterns and XSS attempts
    const cleanSegment = segment
      .replace(/[<>:"|?*]/g, '')  // Remove invalid path characters
      .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
      .replace(/\bon\w+\s*=/gi, '')  // Remove event handlers
      .replace(/javascript:/gi, '')  // Remove javascript protocol
      .replace(/<script/gi, '');  // Remove script tags

    if (cleanSegment) {
      result.push(cleanSegment);
    }
  }

  // Reconstruct path
  return '/' + result.join('/');
}

/**
 * Validates if a path is safe to use
 */
export function isValidPath(path: string): boolean {
  // Check for null bytes and control characters
  if (/[\x00-\x1F\x7F]/.test(path)) {
    return false;
  }

  // Check for malicious protocols that might be used as paths
  const maliciousProtocols = [
    /^javascript:/i,
    /^data:/i,
    /^vbscript:/i,
    /^file:/i,
    /^ftp:/i,
  ];

  for (const pattern of maliciousProtocols) {
    if (pattern.test(path)) {
      return false;
    }
  }

  // Check for directory traversal patterns
  const traversalPatterns = [
    /\.\.\//,           // ../
    /\.\.\\/,           // ..\
    /%2e%2e/i,          // URL encoded ..
    /\.\.%2f/i,         // Mixed encoding
    /%252e%252e/i,      // Double encoded
  ];

  for (const pattern of traversalPatterns) {
    if (pattern.test(path)) {
      return false;
    }
  }

  // Check for absolute paths that might escape the intended directory
  if (path.startsWith('/etc/') || path.startsWith('/usr/') ||
      path.startsWith('C:\\') || path.includes(':\\')) {
    return false;
  }

  return true;
}

/**
 * Creates a detailed error message with security context
 */
export function createSecurityError(
  operation: string,
  input: string,
  reason: string,
): Error {
  const error = new Error(
    `Security validation failed for ${operation}: ${reason}. ` +
    `Input: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"`
  );
  error.name = 'SecurityValidationError';
  return error;
}