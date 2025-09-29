# @snapkit-studio/core

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/core.svg)](https://www.npmjs.com/package/@snapkit-studio/core)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/core.svg)](https://www.npmjs.com/package/@snapkit-studio/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Unified image optimization engine for Snapkit Studio. This package provides the core **SnapkitImageEngine** that powers both React and Next.js packages, offering consistent image optimization across all frameworks with CDN provider strategies, URL building, format detection, responsive utilities, and advanced transformations.

## Installation

```bash
npm install @snapkit-studio/core
# or
yarn add @snapkit-studio/core
# or
pnpm add @snapkit-studio/core
```

## Features

- **🏗️ CDN Provider Strategy** - Support for Snapkit CDN and custom CDN providers
- **🔧 URL Builder** - Construct optimized image URLs with transformations
- **🌐 Format Detection** - Detect browser support for AVIF, WebP, and other formats
- **📱 Responsive Utilities** - Calculate optimal sizes and generate responsive configurations
- **⚙️ Transform Builder** - Type-safe image transformation parameter building
- **🌍 Browser Compatibility** - Cross-browser compatibility utilities
- **📝 TypeScript Support** - Full type definitions included
- **🔄 Environment Configuration** - Flexible environment variable configuration

## CDN Provider Configuration

### Snapkit CDN (Recommended)

Use Snapkit's optimized CDN for best performance and automatic optimizations:

```typescript
import { SnapkitImageEngine } from '@snapkit-studio/core';

const engine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'snapkit',
    organizationName: 'your-organization',
  },
  defaultQuality: 85,
  defaultFormat: 'auto',
});
```

### Custom CDN Providers

Bring your own CDN for maximum flexibility:

```typescript
import { SnapkitImageEngine } from '@snapkit-studio/core';

// AWS CloudFront
const cloudFrontEngine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'custom',
    baseUrl: 'https://d1234567890.cloudfront.net',
  },
  defaultQuality: 85,
  defaultFormat: 'auto',
});

// Google Cloud Storage
const gcsEngine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'custom',
    baseUrl: 'https://storage.googleapis.com/my-image-bucket',
  },
  defaultQuality: 85,
  defaultFormat: 'auto',
});

// Cloudflare Images
const cloudflareEngine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'custom',
    baseUrl: 'https://images.example.com',
  },
  defaultQuality: 85,
  defaultFormat: 'auto',
});
```

## Environment Variable Configuration

Configure CDN settings through environment variables for different deployment environments:

### Snapkit CDN Configuration

```bash
# .env or .env.local
IMAGE_CDN_PROVIDER=snapkit
SNAPKIT_ORGANIZATION=your-organization
```

### Custom CDN Configuration

```bash
# AWS CloudFront
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://d1234567890.cloudfront.net

# Google Cloud Storage
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://storage.googleapis.com/my-image-bucket

# Cloudflare or custom domain
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://images.example.com
```

### Framework-Specific Environment Variables

#### Next.js
```bash
# .env.local
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=snapkit
NEXT_PUBLIC_SNAPKIT_ORGANIZATION=your-organization

# or for custom CDN
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=custom
NEXT_PUBLIC_IMAGE_CDN_URL=https://d1234567890.cloudfront.net
```

#### Vite/React
```bash
# .env
VITE_IMAGE_CDN_PROVIDER=snapkit
VITE_SNAPKIT_ORGANIZATION=your-organization

# or for custom CDN
VITE_IMAGE_CDN_PROVIDER=custom
VITE_IMAGE_CDN_URL=https://d1234567890.cloudfront.net
```

### Automatic Environment Detection

The library automatically detects your framework and reads the appropriate environment variables:

```typescript
import { getCdnConfig, SnapkitImageEngine } from '@snapkit-studio/core';

// Automatically detects environment and loads CDN configuration
const cdnConfig = getCdnConfig();
const engine = new SnapkitImageEngine({
  cdnConfig,
  defaultQuality: 85,
  defaultFormat: 'auto',
});
```

## Quick Start

### Basic Image Optimization

```typescript
import { SnapkitImageEngine } from '@snapkit-studio/core';

const engine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'snapkit',
    organizationName: 'your-organization',
  },
  defaultQuality: 85,
  defaultFormat: 'auto',
});

// Generate optimized image URL
const imageData = engine.generateImageData({
  src: '/photos/landscape.jpg',
  width: 800,
  height: 600,
  quality: 90,
});

console.log(imageData.url);
// Output: https://your-organization-cdn.snapkit.studio/photos/landscape.jpg?w=800&h=600&quality=90
```

### Responsive Images

```typescript
// Generate responsive srcSet
const responsiveData = engine.generateImageData({
  src: '/photos/portrait.jpg',
  width: 400,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
});

console.log(responsiveData.srcSet);
// Output: "https://...portrait.jpg?w=400 400w, https://...portrait.jpg?w=800 800w, ..."
```

### Next.js Integration

```typescript
// Create Next.js loader
const nextLoader = engine.createNextJsLoader();

// Use with Next.js Image component
<Image
  src="/photos/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  loader={nextLoader}
/>
```

## URL Builder

Direct URL building for advanced use cases:

```typescript
import { SnapkitUrlBuilder, UrlBuilderFactory } from '@snapkit-studio/core';

// Using factory (recommended for caching)
const builder = UrlBuilderFactory.getInstance({
  provider: 'snapkit',
  organizationName: 'your-organization',
});

// Basic URL
const imageUrl = builder.buildImageUrl('/photos/sunset.jpg');
// Output: https://your-organization-cdn.snapkit.studio/photos/sunset.jpg

// URL with transformations
const transformedUrl = builder.buildTransformedUrl('/photos/sunset.jpg', {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp',
  fit: 'cover',
  blur: 10,
});
// Output: https://your-organization-cdn.snapkit.studio/photos/sunset.jpg?w=800&h=600&quality=85&format=webp&fit=cover&blur=10

// Generate srcSet for responsive images
const srcSet = builder.buildSrcSet('/photos/sunset.jpg', [400, 800, 1200], {
  quality: 85,
  format: 'webp',
});
// Output: "https://...?w=400&quality=85&format=webp 400w, https://...?w=800&quality=85&format=webp 800w, ..."

// Generate format URLs for picture element
const formatUrls = builder.buildFormatUrls('/photos/sunset.jpg', {
  width: 800,
  height: 600,
  quality: 85,
});
console.log(formatUrls);
// Output: {
//   avif: "https://...?w=800&h=600&format=avif&quality=85",
//   webp: "https://...?w=800&h=600&format=webp&quality=85",
//   original: "https://...?w=800&h=600&quality=85"
// }
```

## Format Detection

```typescript
import {
  estimateFormatSupportFromUA,
  getBestSupportedFormat,
  preloadFormatSupport,
  supportsImageFormat,
} from '@snapkit-studio/core';

// Check format support
const supportsAVIF = supportsImageFormat('avif');
const supportsWebP = supportsImageFormat('webp');

// Get best format for browser
const bestFormat = getBestSupportedFormat(['avif', 'webp', 'jpeg']);

// Server-side format detection
const serverSupport = estimateFormatSupportFromUA(userAgent);

// Preload format detection (runs tests in background)
preloadFormatSupport();
```

## Responsive Utilities

```typescript
import {
  adjustQualityForConnection,
  calculateOptimalImageSize,
  generateResponsiveWidths,
} from '@snapkit-studio/core';

// Generate responsive width array
const widths = generateResponsiveWidths(1200, { steps: 5, minWidth: 300 });
// Result: [300, 450, 600, 900, 1200]

// Calculate optimal size for container
const optimalSize = calculateOptimalImageSize(
  { width: 800, height: 600 },
  { maxWidth: 1200, pixelDensity: 2 },
);

// Adjust quality based on connection
const adjustedQuality = adjustQualityForConnection(85, {
  effectiveType: '3g',
  saveData: false,
});
```

## Advanced Transform Builder

```typescript
import { SnapkitTransformBuilder } from '@snapkit-studio/core';

const transforms = new SnapkitTransformBuilder()
  .resize(800, 600, 'cover')
  .quality(85)
  .blur(20)
  .grayscale()
  .flip()
  .extract(100, 100, 300, 200)
  .build();

// Use with URL builder
const url = builder.buildTransformedUrl('/image.jpg', transforms);
```

## Core Types

```typescript
// CDN Configuration
interface CdnConfig {
  provider: 'snapkit' | 'custom';
  organizationName?: string; // Required for snapkit provider
  baseUrl?: string; // Required for custom provider
}

// Snapkit Configuration
interface SnapkitConfig {
  cdnConfig: CdnConfig;
  defaultQuality?: number;
  defaultFormat?: ImageFormat;
}

// Image transformations
interface ImageTransforms {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  blur?: number | boolean;
  grayscale?: boolean;
  flip?: boolean;
  flop?: boolean;
  dpr?: number;
  extract?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Image formats
type ImageFormat = 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | 'gif';

// Environment strategy
interface EnvironmentStrategy {
  name: string;
  detect: () => boolean;
  getEnvVar: (key: string) => string | undefined;
}
```

## Migration Guide

### From v1.x to v2.x

The major breaking change is the move from `organizationName` directly in `SnapkitConfig` to the new `cdnConfig` structure:

#### Before (v1.x)
```typescript
const config: SnapkitConfig = {
  organizationName: 'your-organization',
  defaultQuality: 85,
  defaultFormat: 'auto',
};
```

#### After (v2.x)
```typescript
const config: SnapkitConfig = {
  cdnConfig: {
    provider: 'snapkit',
    organizationName: 'your-organization',
  },
  defaultQuality: 85,
  defaultFormat: 'auto',
};
```

### URL Builder Changes

#### Before (v1.x)
```typescript
const urlBuilder = new SnapkitUrlBuilder('your-organization');
```

#### After (v2.x)
```typescript
const urlBuilder = new SnapkitUrlBuilder({
  provider: 'snapkit',
  organizationName: 'your-organization',
});

// Or use the factory (recommended)
const urlBuilder = UrlBuilderFactory.getInstance({
  provider: 'snapkit',
  organizationName: 'your-organization',
});
```

### Environment Variables

New environment variables provide more flexibility:

```bash
# v2.x Environment variables
IMAGE_CDN_PROVIDER=snapkit           # or 'custom'
SNAPKIT_ORGANIZATION=your-org        # for snapkit provider
IMAGE_CDN_URL=https://cdn.example.com  # for custom provider
```

## Browser Compatibility

The core package includes utilities for handling browser compatibility:

```typescript
import {
  detectBrowserFeatures,
  getCompatibilityLayer,
  isModernBrowser,
} from '@snapkit-studio/core';

// Detect browser capabilities
const features = detectBrowserFeatures();
// Returns: { avif: boolean, webp: boolean, lazyLoading: boolean, ... }

// Check if modern browser
const isModern = isModernBrowser();

// Get compatibility shims
const compat = getCompatibilityLayer();
```

## Network Optimization

Automatic quality adjustment based on network conditions:

```typescript
import { adjustQualityForConnection } from '@snapkit-studio/core';

// Adjust quality based on connection
const baseQuality = 85;
const connection = navigator.connection;

const optimizedQuality = adjustQualityForConnection(baseQuality, {
  effectiveType: connection?.effectiveType,
  saveData: connection?.saveData,
  downlink: connection?.downlink,
});

// Quality reductions:
// - 4G/WiFi: No reduction (85%)
// - 3G: 20% reduction (68%)
// - 2G/Slow: 40% reduction (51%)
// - Data Saver: 30% reduction (60%)
```

## Testing

The package includes comprehensive test coverage with automatic coverage reporting:

```bash
# Run tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm test -- --watch
```

### Test Coverage

The package maintains high test coverage standards:

- **Coverage Threshold**: 80% minimum for branches, functions, lines, and statements
- **Test Framework**: Vitest with v8 coverage provider
- **Coverage Reports**: Text (console), JSON, HTML, and LCOV formats
- **Coverage Exclusions**: Configuration files, type definitions, and test utilities

Coverage reports are generated in multiple formats:

- **Text**: Console output during test runs
- **HTML**: Detailed coverage report in `coverage/` directory
- **LCOV**: For CI/CD integration and coverage tools
- **JSON**: Machine-readable coverage data

## Development

```bash
# Install dependencies
npm install

# Build package
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run check-types

# Linting
npm run lint
```

## Contributing

See the main [repository README](../../README.md) for contribution guidelines.

## License

MIT