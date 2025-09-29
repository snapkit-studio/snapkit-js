# Migrating from Next.js Image to Snapkit

This guide provides a step-by-step migration path from Next.js built-in Image component to `@snapkit-studio/nextjs`.

## 📋 Table of Contents

- [Migration Overview](#migration-overview)
- [Compatibility Matrix](#compatibility-matrix)
- [Step-by-Step Migration](#step-by-step-migration)
- [Code Conversion Examples](#code-conversion-examples)
- [Advanced Features](#advanced-features)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## 🔄 Migration Overview

### Why migrate to Snapkit?

| Feature | Next.js Image | Snapkit Image |
|---------|---------------|---------------|
| **Automatic Format Optimization** | ❌ | ✅ Auto AVIF → WebP → JPEG selection |
| **Real-time Image Transforms** | ❌ | ✅ URL-based real-time transformation |
| **Network-adaptive Quality** | ❌ | ✅ Auto quality adjustment by network |
| **DPR Optimization** | Basic | ✅ Intelligent DPR detection & optimization |
| **CDN Flexibility** | Next.js config dependent | ✅ Snapkit CDN + Custom CDN support |
| **Bundle Size** | Included in Next.js | ✅ ~15KB standalone |

### Migration Difficulty: **Easy** ⭐⭐⭐⭐⭐

Snapkit Image provides **100% API compatibility** with Next.js Image, so in most cases you only need to change the import statement.

## 🎯 Compatibility Matrix

### ✅ Fully Compatible Props

The following props work without any changes:

```typescript
// Works identically to Next.js Image
src, alt, width, height, priority, placeholder, blurDataURL,
fill, sizes, quality, loading, style, className, onClick,
onLoad, onError, onLoadingComplete
```

### 🆕 Snapkit-Exclusive Additional Features

```typescript
interface SnapkitImageProps extends NextImageProps {
  // Real-time image transformations
  transforms?: {
    format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
    blur?: number;
    grayscale?: boolean;
    // ... more transformation options
  };

  // DPR optimization
  dprOptions?: {
    maxDpr?: number;
    qualityStep?: number;
  };

  // Network-adaptive quality (coming soon)
  adjustQualityByNetwork?: boolean;
}
```

### ⚠️ Important Notes

1. **Client Component Only**: Currently requires `'use client'` directive
2. **Loader Exclusion**: `loader` prop is handled internally and should be removed

## 🚀 Step-by-Step Migration

### Step 1: Install Package

```bash
npm install @snapkit-studio/nextjs
# or
yarn add @snapkit-studio/nextjs
# or
pnpm add @snapkit-studio/nextjs
```

### Step 2: Configure Environment Variables

#### Option A: Snapkit CDN (Recommended)

```bash
# .env.local
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=snapkit
NEXT_PUBLIC_SNAPKIT_ORGANIZATION=your-organization-name
```

#### Option B: Use Existing CDN

```bash
# .env.local
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=custom
NEXT_PUBLIC_IMAGE_CDN_URL=https://d1234567890.cloudfront.net
```

### Step 3: Update Import Statements

```typescript
// Before: Next.js Image
import Image from 'next/image';

// After: Snapkit Image
'use client';
import { Image } from '@snapkit-studio/nextjs';
```

### Step 4: Update next.config.js (Optional)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add Snapkit domains
    domains: [
      'your-org-name.snapkit.studio',  // Snapkit CDN
      // ... existing domains
    ],
  },
};

module.exports = nextConfig;
```

## 💻 Code Conversion Examples

### Basic Image

```typescript
// ❌ Before: Next.js Image
import Image from 'next/image';

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}

// ✅ After: Snapkit Image
'use client';
import { Image } from '@snapkit-studio/nextjs';

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority
    />
  );
}
```

### Responsive Image

```typescript
// ❌ Before: Next.js Image
import Image from 'next/image';

export function ResponsiveImage() {
  return (
    <Image
      src="/responsive.jpg"
      alt="Responsive"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: 'cover' }}
    />
  );
}

// ✅ After: Snapkit Image (identical code)
'use client';
import { Image } from '@snapkit-studio/nextjs';

export function ResponsiveImage() {
  return (
    <Image
      src="/responsive.jpg"
      alt="Responsive"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: 'cover' }}
    />
  );
}
```

### Image with Event Handlers

```typescript
// ❌ Before: Next.js Image
import Image from 'next/image';
import { useState } from 'react';

export function InteractiveImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src="/interactive.jpg"
      alt="Interactive"
      width={800}
      height={600}
      onLoad={() => setLoaded(true)}
      onError={() => console.log('Failed to load')}
    />
  );
}

// ✅ After: Snapkit Image (identical code, just add 'use client')
'use client';
import { Image } from '@snapkit-studio/nextjs';
import { useState } from 'react';

export function InteractiveImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src="/interactive.jpg"
      alt="Interactive"
      width={800}
      height={600}
      onLoad={() => setLoaded(true)}
      onError={() => console.log('Failed to load')}
    />
  );
}
```

## 🎨 Advanced Features

After migration, you can leverage Snapkit's exclusive advanced features:

### Automatic Format Optimization

```typescript
'use client';
import { Image } from '@snapkit-studio/nextjs';

export function OptimizedImage() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={800}
      height={600}
      // 🆕 Auto format selection: AVIF → WebP → JPEG
      transforms={{ format: 'auto' }}
    />
  );
}
```

### Real-time Image Effects

```typescript
'use client';
import { Image } from '@snapkit-studio/nextjs';

export function ArtisticImage() {
  return (
    <Image
      src="/portrait.jpg"
      alt="Portrait"
      width={600}
      height={800}
      // 🆕 Real-time image transformations
      transforms={{
        format: 'auto',
        quality: 85,
        blur: 2,           // Blur effect
        grayscale: true,   // Grayscale conversion
      }}
    />
  );
}
```

### DPR Optimization

```typescript
'use client';
import { Image } from '@snapkit-studio/nextjs';

export function HighDPRImage() {
  return (
    <Image
      src="/high-res.jpg"
      alt="High Resolution"
      width={1000}
      height={800}
      // 🆕 DPR optimization settings
      dprOptions={{
        maxDpr: 3,        // Support up to 3x DPR
        qualityStep: 10,  // Quality step by DPR
      }}
    />
  );
}
```

## ⚡ Performance Optimization

### 1. Bundle Size Optimization

```typescript
// ✅ Import only needed components
import { Image } from '@snapkit-studio/nextjs';

// ❌ Avoid full package imports
// import * as Snapkit from '@snapkit-studio/nextjs';
```

### 2. Image Priority Settings

```typescript
'use client';
import { Image } from '@snapkit-studio/nextjs';

export function OptimizedPage() {
  return (
    <>
      {/* Above-the-fold image: set priority */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        priority  // ✅ Priority loading
      />

      {/* Below-the-fold image: lazy loading */}
      <Image
        src="/gallery-1.jpg"
        alt="Gallery 1"
        width={400}
        height={300}
        loading="lazy"  // ✅ Lazy loading
      />
    </>
  );
}
```

### 3. Quality vs Size Optimization

```typescript
// Quality settings for different use cases
export function QualityOptimizedImages() {
  return (
    <>
      {/* Thumbnail: Lower quality for fast loading */}
      <Image
        src="/thumbnail.jpg"
        alt="Thumbnail"
        width={150}
        height={150}
        quality={60}
        transforms={{ format: 'auto' }}
      />

      {/* Main image: Higher quality */}
      <Image
        src="/main-photo.jpg"
        alt="Main Photo"
        width={1000}
        height={800}
        quality={90}
        transforms={{ format: 'auto' }}
      />
    </>
  );
}
```

## 🔧 Troubleshooting

### Issue 1: Hydration Errors

**Symptoms**: Server and client rendering mismatch

**Solution**:
```typescript
// ❌ Problematic code
import { Image } from '@snapkit-studio/nextjs';

// ✅ Fixed code
'use client';  // Add client directive
import { Image } from '@snapkit-studio/nextjs';
```

### Issue 2: Images Not Loading

**Symptoms**: Images don't display or 404 errors

**Solutions**:
1. Check environment variables:
```bash
# .env.local file check
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=snapkit
NEXT_PUBLIC_SNAPKIT_ORGANIZATION=your-org-name
```

2. Add domains to next.config.js:
```javascript
const nextConfig = {
  images: {
    domains: ['your-org-name.snapkit.studio'],
  },
};
```

### Issue 3: TypeScript Type Errors

**Symptoms**: TypeScript compilation errors

**Solution**:
```typescript
// ❌ Type error occurs
import { Image } from '@snapkit-studio/nextjs';

const MyImage: React.FC = () => (
  <Image
    src="/image.jpg"
    alt="Image"
    width={800}
    height={600}
    loader={() => '...'} // ❌ loader not supported
  />
);

// ✅ Correct usage
const MyImage: React.FC = () => (
  <Image
    src="/image.jpg"
    alt="Image"
    width={800}
    height={600}
    transforms={{ format: 'auto' }} // ✅ Use transforms
  />
);
```

### Issue 4: Performance Degradation

**Symptoms**: Slow image loading

**Solutions**:
1. Adjust quality settings:
```typescript
<Image
  src="/image.jpg"
  alt="Image"
  width={800}
  height={600}
  quality={85} // Adjust from default 75
  transforms={{ format: 'auto' }}
/>
```

2. Set priority:
```typescript
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Set for above-the-fold images
/>
```

## ❓ FAQ

### Q1: Can I use both Next.js Image and Snapkit Image simultaneously?

**A**: Yes, you can use both components for gradual migration.

```typescript
// Existing Next.js Image
import NextImage from 'next/image';

// New Snapkit Image
import { Image as SnapkitImage } from '@snapkit-studio/nextjs';

export function MixedImages() {
  return (
    <>
      <NextImage src="/old.jpg" alt="Old" width={800} height={600} />
      <SnapkitImage src="/new.jpg" alt="New" width={800} height={600} />
    </>
  );
}
```

### Q2: Can I use it in Server Components?

**A**: The current version is client-only and requires `'use client'` directive in all component files. Server Component support is planned for future updates.

### Q3: What happens to existing image optimization settings?

**A**: Snapkit uses its own optimization engine, so these settings are ignored:
- `next.config.js`'s `images.formats`
- `images.deviceSizes`, `images.imageSizes`
- Custom `loader` functions

Use Snapkit's `transforms` prop instead.

### Q4: How is caching handled?

**A**: Snapkit CDN provides optimized caching automatically:
- **CDN Caching**: Cached at global edge locations
- **Browser Caching**: Appropriate Cache-Control headers set
- **Transform Caching**: Identical transformation parameters served from cache instantly

### Q5: How is pricing calculated?

**A**: For Snapkit CDN usage:
- **Free Tier**: 1GB bandwidth per month
- **Pay-as-you-go**: Reasonable pricing for additional usage
- **Custom CDN**: Free (only your own CDN costs apply)

See [Snapkit Pricing](https://snapkit.studio/pricing) for details.

### Q6: Can I migrate without quality degradation?

**A**: Actually, quality will improve:
- **Auto Format Selection**: Better compression with AVIF/WebP
- **DPR Optimization**: Sharper images on high-resolution displays
- **Real-time Optimization**: Adaptive quality based on network conditions

## 📚 Additional Resources

- [Snapkit Official Documentation](https://docs.snapkit.studio)
- [Next.js Demo](https://nextjs.snapkit.studio) - Live examples
- [GitHub Issues](https://github.com/snapkit-studio/snapkit-js/issues) - Report issues and questions
- [Discord Community](https://discord.gg/snapkit) - Real-time support

---

**After completing migration, refer to the [Performance Optimization Guide](./PERFORMANCE.md) for even better performance.**