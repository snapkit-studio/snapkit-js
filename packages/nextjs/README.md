# @snapkit-studio/nextjs

Next.js image loader and React component for Snapkit image optimization service.

[![npm version](https://img.shields.io/npm/v/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![npm downloads](https://img.shields.io/npm/dm/@snapkit-studio/nextjs.svg)](https://www.npmjs.com/package/@snapkit-studio/nextjs)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Features

- **Next.js Image Integration**: Seamless integration with Next.js Image component
- **Automatic Optimization**: Dynamic image transformation with DPR-based srcset
- **Client Component**: 현재 `Image` 컴포넌트는 클라이언트 전용이며 `'use client'` 지시자가 필요합니다.
- **Flexible Configuration**: Global and per-component configuration options
- **Format Auto-Selection**: Intelligent format selection (WebP, AVIF, etc.)
- **Client-First Enhancements**: Built-in network adaptation and event handler support
- **TypeScript Support**: Full TypeScript definitions included
- **Well Tested**: 90%+ test coverage with comprehensive edge case handling

## Installation

```bash
npm install @snapkit-studio/nextjs
# or
yarn add @snapkit-studio/nextjs
# or
pnpm add @snapkit-studio/nextjs
```

## Quick Start

### 1. Environment Configuration

```bash
# .env.local (Required and Optional variables)
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name  # Required
NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY=85                       # Optional (default: 85)
NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto             # Optional (default: auto)
```

### 2. Use with Next.js Image Component

```typescript
'use client';

// app/components/Hero.tsx
import { Image } from '@snapkit-studio/nextjs';

export function Hero() {
  return (
    <Image
      src="/hero-image.jpg"
      width={1200}
      height={600}
      alt="Hero image"
      transforms={{
        format: 'auto',
        quality: 85,
      }}
    />
  );
}
```

## Usage Patterns

### Pattern 1: Environment Variables (Recommended)

Best for most applications where you want consistent optimization across all images.

```bash
# .env.local - All available environment variables
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name  # Required
NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY=85                       # Optional (1-100, default: 85)
NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT=auto             # Optional (auto|avif|webp|off, default: auto)
```

**Environment Variables Reference:**

- `NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME`: Your Snapkit organization identifier (required)
- `NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY`: Global quality setting for all images (1-100)
- `NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT`: Default format optimization strategy
  - `auto`: Automatically select best format based on browser support
  - `avif`: Use AVIF format if supported
  - `webp`: Use WebP format if supported
  - `off`: Disable format optimization

```typescript
'use client';

import { Image } from '@snapkit-studio/nextjs';

// Optimized image (zero config beyond env vars)
<Image src="/photo.jpg" width={800} height={600} alt="Photo" />

// Interactive image with event handlers
<Image
  src="/interactive.jpg"
  width={800}
  height={600}
  alt="Interactive"
  onLoad={() => console.log('loaded')}
/>
```

### Pattern 2: Direct Props (Advanced)

Use when you need different optimization settings per image instance.

```typescript
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/high-quality-photo.jpg"
  width={1920}
  height={1080}
  alt="High quality photo"
  organizationName="custom-org"
  transforms={{
    format: 'avif',
    quality: 90,
  }}
/>
```

### Pattern 3: Direct Loader Usage

For maximum control or integration with custom image components.

```typescript
import { snapkitLoader } from '@snapkit-studio/nextjs';

// Get optimized URL directly
const optimizedUrl = snapkitLoader({
  src: '/my-image.jpg',
  width: 800,
  quality: 85,
});

console.log(optimizedUrl);
// Output: "https://your-org-name.snapkit.studio/transform/w_800,q_85,f_auto/my-image.jpg"
```

## Image Transforms

```typescript
interface ImageTransforms {
  /** Output format: 'auto', 'webp', 'avif', 'jpeg', 'png' */
  format?: string;

  /** Image quality: 1-100 */
  quality?: number;

  /** Image width in pixels */
  width?: number;

  /** Image height in pixels */
  height?: number;

  /** Blur radius: 0-100 */
  blur?: number;

  /** Additional transforms... */
  [key: string]: any;
}
```

## Component Architecture

`@snapkit-studio/nextjs`는 단일 `Image` 컴포넌트를 제공합니다.

- 현재 버전은 클라이언트 전용이며, 사용 시 반드시 파일 상단에 `'use client'` 지시자를 추가해야 합니다.
- 서버 컴포넌트(React Server Components) 지원은 준비 중이며, 로드맵에 포함되어 있습니다.
- 클라이언트 측에서 네트워크 기반 품질 조정, 이벤트 핸들러 등 고급 기능을 제공합니다.

### Examples

```typescript
'use client';

import { Image } from '@snapkit-studio/nextjs';

export function HeroBanner() {
  return (
    <section>
      <Image
        src="/hero-banner.jpg"
        width={1920}
        height={1080}
        alt="Hero banner"
        priority
      />
    </section>
  );
}
```

```typescript
'use client';

import { Image } from '@snapkit-studio/nextjs';
import { useState } from 'react';

export function Gallery() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set([...prev, src]));
  };

  return (
    <div className="gallery">
      <Image
        src="/gallery-image.jpg"
        width={800}
        height={600}
        alt="Gallery image"
        onLoad={() => handleImageLoad('gallery-image.jpg')}
        onError={() => console.log('Failed to load image')}
      />
    </div>
  );
}
```

## Advanced Configuration

### Custom Organization Name

```typescript
// Override environment variable per component
import { Image } from '@snapkit-studio/nextjs';

export function Gallery({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          width={400}
          height={300}
          alt={`Gallery image ${index + 1}`}
          organizationName="custom-org"
          transforms={{ format: 'auto', quality: 80 }}
        />
      ))}
    </div>
  );
}
```

### Advanced Transforms

```typescript
<Image
  src="/portrait.jpg"
  width={600}
  height={800}
  alt="Portrait"
  transforms={{
    format: 'webp',
    quality: 85,
    blur: 2,                    // Slight blur effect
  }}
/>
```

## Next.js Configuration

### next.config.js Setup

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Snapkit domains
    domains: ['your-org-name.snapkit.studio'],

    // Use custom loader globally (optional)
    loader: 'custom',
    loaderFile: './snapkit-loader.js',
  },
};

module.exports = nextConfig;
```

### Custom Loader File (snapkit-loader.js)

```javascript
// snapkit-loader.js
import { snapkitLoader } from '@snapkit-studio/nextjs';

export default snapkitLoader;
```

## Live Demo

Experience all features in action with our interactive demo:

**[🚀 Live Demo →](https://nextjs.snapkit.studio)** - Real-time examples with source code

Explore features including:

- Multiple patterns built with the single `Image` component
- DPR-aware optimization and automatic `srcSet`
- Live preview of image transformations
- Server-rendered picture element output
- Full tour of Snapkit’s optimization pipeline

## Migration Guide

### From Next.js Built-in Optimization

```typescript
// Before: Next.js built-in
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Image"
/>

// After: Snapkit optimization with Snapkit Image
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Image"
  transforms={{ format: 'webp', quality: 85 }}
/>
```

### From Other Image Services

```typescript
// Before: Cloudinary
import Image from 'next/image';

<Image
  src="https://res.cloudinary.com/demo/image/upload/w_800,q_85/sample.jpg"
  width={800}
  height={600}
/>

// After: Snapkit with Snapkit Image
import { Image } from '@snapkit-studio/nextjs';

<Image
  src="/sample.jpg"
  width={800}
  height={600}
  transforms={{ width: 800, quality: 85 }}
/>
```

## API Reference

### Functions

#### `snapkitLoader(params: ImageLoaderParams): string`

Default image loader using global configuration.

**Parameters:**

- `src`: Image source path
- `width`: Target width in pixels
- `quality`: Image quality (1-100)

**Returns:** Optimized image URL

#### `createSnapkitLoader(): ImageLoader`

Create a custom image loader with specific configuration.

**Returns:** Image loader function

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
- **Coverage Exclusions**: Test setup files, configuration files, type definitions, and test utilities

Coverage reports are generated in multiple formats:

- **Text**: Console output during test runs
- **HTML**: Detailed coverage report in `coverage/` directory
- **LCOV**: For CI/CD integration and coverage tools
- **JSON**: Machine-readable coverage data

### Test Environment

Tests run in a jsdom environment to simulate browser behavior for React Server Components and Client Components testing.

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details on our code of conduct and development process.

## License

MIT © [Snapkit](https://snapkit.studio)
