/**
 * Utility functions for Snapkit Studio image optimization
 */

import { BYTES_PER_KB } from './constants';

/**
 * Convert bytes to human readable format
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with appropriate unit
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = BYTES_PER_KB;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate file size reduction percentage
 * @param originalSize - Original file size in bytes
 * @param optimizedSize - Optimized file size in bytes
 * @returns Percentage reduction as a number (0-100)
 */
export function calculateSizeReduction(
  originalSize: number,
  optimizedSize: number,
): number {
  if (originalSize <= 0) return 0;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  return Math.max(0, Math.min(100, Math.round(reduction * 100) / 100));
}

/**
 * Check if an image URL is from Snapkit Studio CDN
 * @param url - Image URL to check
 * @returns True if URL is from Snapkit CDN
 */
export function isSnapkitUrl(url: string): boolean {
  try {
    const parsedUrl = new globalThis.URL(url);
    return (
      parsedUrl.hostname.includes('snapkit.studio') ||
      parsedUrl.hostname.includes('snapkit-cdn.com')
    );
  } catch {
    return false;
  }
}

/**
 * Extract image dimensions from a URL if present
 * @param url - Image URL with potential dimension parameters
 * @returns Object with width and height if found, null otherwise
 */
export function extractDimensionsFromUrl(
  url: string,
): { width: number; height: number } | null {
  try {
    const parsedUrl = new globalThis.URL(url);
    const width =
      parsedUrl.searchParams.get('w') || parsedUrl.searchParams.get('width');
    const height =
      parsedUrl.searchParams.get('h') || parsedUrl.searchParams.get('height');

    if (width && height) {
      return {
        width: parseInt(width, 10),
        height: parseInt(height, 10),
      };
    }
  } catch {
    // Invalid URL
  }

  return null;
}
