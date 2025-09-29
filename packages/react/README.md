# @snapkit-studio/react

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/react.svg)](https://www.npmjs.com/package/@snapkit-studio/react)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/react.svg)](https://www.npmjs.com/package/@snapkit-studio/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

React components and hooks for Snapkit Studio image optimization. This package provides high-performance React image components with automatic format optimization, responsive loading, and Next.js-compatible APIs.

## Installation

```bash
npm install @snapkit-studio/react
# or
yarn add @snapkit-studio/react
# or
pnpm add @snapkit-studio/react
```

## Features

- **React Image Component** - Drop-in replacement for HTML img with optimization
- **Flexible CDN Configuration** - Use Snapkit CDN or integrate with your existing infrastructure (CloudFront, GCS, Cloudflare)
- **Provider-less Architecture** - Direct component usage without wrappers
- **Next.js Compatible** - Same API as Next.js Image component
- **Environment Auto-Detection** - Automatically reads framework-specific environment variables
- **Automatic Format Detection** - AVIF, WebP, JPEG fallback
- **Responsive Images** - Automatic srcset generation
- **DPR-based Optimization** - Crisp images on high-DPI displays
- **Lazy Loading** - Intersection Observer based
- **Network-aware Quality** - Automatic adjustment based on connection
- **TypeScript Support** - Full type definitions included

## Quick Start

### 1. CDN Configuration

Choose between Snapkit CDN for zero-config optimization or custom CDN integration:

#### Option A: Snapkit CDN (Recommended)

```bash
# .env (Vite/CRA) - Snapkit CDN
VITE_IMAGE_CDN_PROVIDER=snapkit
VITE_SNAPKIT_ORGANIZATION=your-organization-name
```

#### Option B: Custom CDN Integration

```bash
# .env (Vite/CRA) - Custom CDN (Google Cloud Storage example)
VITE_IMAGE_CDN_PROVIDER=custom
VITE_IMAGE_CDN_URL=https://storage.googleapis.com/my-image-bucket

# AWS CloudFront example
# VITE_IMAGE_CDN_PROVIDER=custom
# VITE_IMAGE_CDN_URL=https://d1234567890.cloudfront.net

# Cloudflare or any custom domain
# VITE_IMAGE_CDN_PROVIDER=custom
# VITE_IMAGE_CDN_URL=https://images.example.com
```

### 2. Basic Usage

```tsx
import { Image } from '@snapkit-studio/react';

function MyComponent() {
  return (
    <Image
      src="/project/hero.jpg"
      alt="Hero Image"
      width={800}
      height={600}
      priority
      transforms={{ format: 'auto' }}
    />
  );
}
```

## Import Options

### Selective Imports (Recommended)

```typescript
// Image component only (~9 KB)

// Specific hooks only (~8 KB)
import { useImageOptimization } from '@snapkit-studio/react/hooks';
import { Image } from '@snapkit-studio/react/image';
// Utility functions only (~5 KB)
import {
  createImageStyle,
  mergeConfiguration,
} from '@snapkit-studio/react/utils';
```

### Full Bundle Import

```typescript
// Full bundle (~22 KB)
import { Image, useImageRefresh } from '@snapkit-studio/react';
```

## CDN Configuration

The library supports flexible CDN configuration through environment variables. Configuration is automatically detected using `getCdnConfig()` from `@snapkit-studio/core`.

### Snapkit CDN

Zero-configuration setup with automatic optimization, smart format delivery, and global edge caching:

```bash
# .env (Vite/CRA)
VITE_IMAGE_CDN_PROVIDER=snapkit
VITE_SNAPKIT_ORGANIZATION=your-organization-name

# .env.local (Next.js) - If using React package in Next.js
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=snapkit
NEXT_PUBLIC_SNAPKIT_ORGANIZATION=your-organization-name
```

### Custom CDN Integration

Use your existing CDN infrastructure with Snapkit's optimization features:

```bash
# .env (Vite/CRA) - Custom CDN examples
VITE_IMAGE_CDN_PROVIDER=custom
VITE_IMAGE_CDN_URL=https://your-cdn-domain.com

# .env.local (Next.js) - Custom CDN examples
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=custom
NEXT_PUBLIC_IMAGE_CDN_URL=https://your-cdn-domain.com
```

### Environment Variables Reference

#### Vite/CRA

| Variable                    | Required For | Description                         |
| --------------------------- | ------------ | ----------------------------------- |
| `VITE_IMAGE_CDN_PROVIDER`   | All setups   | CDN provider: `snapkit` or `custom` |
| `VITE_SNAPKIT_ORGANIZATION` | Snapkit CDN  | Your Snapkit organization name      |
| `VITE_IMAGE_CDN_URL`        | Custom CDN   | Your custom CDN base URL            |

#### Next.js (when using React package)

| Variable                                | Required For | Description                         |
| --------------------------------------- | ------------ | ----------------------------------- |
| `NEXT_PUBLIC_IMAGE_CDN_PROVIDER`        | All setups   | CDN provider: `snapkit` or `custom` |
| `NEXT_PUBLIC_SNAPKIT_ORGANIZATION`      | Snapkit CDN  | Your Snapkit organization name      |
| `NEXT_PUBLIC_IMAGE_CDN_URL`             | Custom CDN   | Your custom CDN base URL            |

## Image Component Props

| Prop               | Type                                  | Default  | Description                  |
| ------------------ | ------------------------------------- | -------- | ---------------------------- |
| `src`              | `string`                              | -        | Image path (required)        |
| `alt`              | `string`                              | -        | Alt text (required)          |
| `width`            | `number`                              | -        | Image width                  |
| `height`           | `number`                              | -        | Image height                 |
| `fill`             | `boolean`                             | `false`  | Fill parent container        |
| `sizes`            | `string`                              | -        | Responsive size settings     |
| `quality`          | `number`                              | `85`     | Image quality (1-100)        |
| `priority`         | `boolean`                             | `false`  | Priority loading             |
| `loading`          | `'lazy' \| 'eager'`                   | `'lazy'` | Loading method               |
| `optimizeFormat`   | `'auto' \| 'avif' \| 'webp' \| 'off'` | `'auto'` | Format optimization          |
| `transforms`       | `ImageTransforms`                     | `{}`     | Image transformation options |
| `organizationName` | `string`                              | -        | Override organization name (deprecated - use environment variables) |

## Key Features

### Automatic Format Detection

```tsx
// Automatically serves AVIF, WebP, or JPEG based on browser
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  optimizeFormat="auto"
/>

// Force specific format
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  optimizeFormat="webp"
/>
```

### Responsive Images

```tsx
// DPR-based srcset (1x, 2x, 3x) - default behavior
<Image
  src="/image.jpg"
  alt="High-DPI optimized"
  width={800}
  height={600}
/>

// Width-based srcset for responsive layouts
<Image
  src="/banner.jpg"
  alt="Responsive banner"
  width={1200}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
/>
```

### Image Transformations

```tsx
// Basic transformations
<Image
  src="/photo.jpg"
  alt="Transformed"
  width={400}
  height={400}
  transforms={{
    fit: "cover",      // contain | cover | fill | inside | outside
    quality: 90,       // Override quality
    blur: 20,          // Blur effect
    grayscale: true,   // Convert to grayscale
  }}
/>

// Extract/crop region
<Image
  src="/large-image.jpg"
  alt="Cropped section"
  width={300}
  height={200}
  transforms={{
    extract: {
      x: 100,
      y: 100,
      width: 300,
      height: 200,
    },
  }}
/>
```

### Loading Control

```tsx
// Priority loading for above-the-fold images
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority={true}
/>

// Lazy loading (default)
<Image
  src="/content.jpg"
  alt="Content image"
  width={400}
  height={300}
  loading="lazy"
/>
```

### Event Handling

```tsx
function ImageWithEvents() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {hasError && <div>Failed to load image</div>}

      <Image
        src="/photo.jpg"
        alt="Photo"
        width={600}
        height={400}
        onLoad={() => {
          setIsLoading(false);
          console.log('Image loaded successfully');
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
          console.log('Failed to load image');
        }}
      />
    </div>
  );
}
```

## Type Definitions

```typescript
// Image component props
interface SnapkitImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  optimizeFormat?: 'auto' | 'avif' | 'webp' | 'off';
  transforms?: ImageTransforms;
  organizationName?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

// Image transformations
interface ImageTransforms {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  blur?: number;
  grayscale?: boolean;
  flip?: boolean;
  flop?: boolean;
  extract?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Image formats
type ImageFormat = 'auto' | 'avif' | 'webp' | 'jpeg' | 'png' | 'gif';
```

## Migration from Next.js Image

The Snapkit Image component is designed to be a drop-in replacement for Next.js Image:

```tsx
// Before (Next.js Image)
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={90}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// After (Snapkit Image)
import { Image } from '@snapkit-studio/react';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={90}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
  // Additional Snapkit features
  transforms={{ fit: "cover" }}
  optimizeFormat="auto"
/>
```

## Live Demo

Experience all features in action with our interactive demo:

**[🚀 Live Demo →](https://react.snapkit.studio)** - Real-time examples with source code

Explore features including:

- Image transformations with live preview
- Error boundary demonstrations
- Network-aware quality adjustments
- DPR optimization examples
- All component props and configurations

## Browser Support

- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+
- **Lazy Loading**: Chrome 76+, Firefox 75+, Safari 15.4+
- **Intersection Observer**: Chrome 58+, Firefox 55+, Safari 12.1+

Automatically falls back to JPEG/PNG in older browsers.

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
- **Test Framework**: Vitest with jsdom environment and v8 coverage provider
- **Coverage Reports**: Text (console), JSON, HTML, and LCOV formats
- **Coverage Exclusions**: Test files, configuration files, type definitions, and test utilities

Coverage reports are generated in multiple formats:

- **Text**: Console output during test runs
- **HTML**: Detailed coverage report in `coverage/` directory
- **LCOV**: For CI/CD integration and coverage tools
- **JSON**: Machine-readable coverage data

### Test Environment

Tests run in a jsdom environment to simulate browser behavior for React components testing.

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
