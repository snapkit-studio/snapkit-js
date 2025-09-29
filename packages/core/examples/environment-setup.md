# Environment Variable Configuration Guide

This guide provides comprehensive instructions for configuring CDN settings using environment variables across different frameworks and deployment environments.

## Overview

The Snapkit Core library supports flexible CDN configuration through environment variables, allowing you to:
- Switch between Snapkit CDN and custom CDN providers
- Configure different CDN settings per environment (development, staging, production)
- Use framework-specific environment variable prefixes
- Maintain secure configurations without hardcoding values

## Environment Variable Reference

### Core Variables

| Variable | Description | Required For | Example |
|----------|-------------|--------------|---------|
| `IMAGE_CDN_PROVIDER` | CDN provider type (`snapkit` or `custom`) | All configurations | `snapkit` |
| `SNAPKIT_ORGANIZATION` | Your Snapkit organization name | Snapkit provider | `my-company` |
| `IMAGE_CDN_URL` | Custom CDN base URL | Custom provider | `https://d123.cloudfront.net` |

### Framework-Specific Prefixes

| Framework | Prefix | Example |
|-----------|--------|---------|
| Next.js | `NEXT_PUBLIC_` | `NEXT_PUBLIC_IMAGE_CDN_PROVIDER` |
| Vite/React | `VITE_` | `VITE_IMAGE_CDN_PROVIDER` |
| Node.js | (none) | `IMAGE_CDN_PROVIDER` |
| Create React App | `REACT_APP_` | `REACT_APP_IMAGE_CDN_PROVIDER` |

## Configuration Examples

### 1. Next.js Configuration

#### `.env.local` (Development)
```bash
# Snapkit CDN for development
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=snapkit
NEXT_PUBLIC_SNAPKIT_ORGANIZATION=my-company-dev

# Image optimization settings
NEXT_PUBLIC_IMAGE_DEFAULT_QUALITY=85
NEXT_PUBLIC_IMAGE_DEFAULT_FORMAT=webp
```

#### `.env.production` (Production)
```bash
# Custom CloudFront CDN for production
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=custom
NEXT_PUBLIC_IMAGE_CDN_URL=https://d1234567890.cloudfront.net

# Production-optimized settings
NEXT_PUBLIC_IMAGE_DEFAULT_QUALITY=90
NEXT_PUBLIC_IMAGE_DEFAULT_FORMAT=auto
```

#### Usage in Next.js
```typescript
// lib/image-config.ts
import { getCdnConfig, SnapkitImageEngine } from '@snapkit-studio/core';

// Automatically detects Next.js environment and reads NEXT_PUBLIC_ variables
const cdnConfig = getCdnConfig();

export const imageEngine = new SnapkitImageEngine({
  cdnConfig,
  defaultQuality: parseInt(process.env.NEXT_PUBLIC_IMAGE_DEFAULT_QUALITY || '85'),
  defaultFormat: (process.env.NEXT_PUBLIC_IMAGE_DEFAULT_FORMAT as any) || 'auto',
});

// components/OptimizedImage.tsx
import Image from 'next/image';
import { imageEngine } from '../lib/image-config';

const nextLoader = imageEngine.createNextJsLoader();

export function OptimizedImage({ src, alt, ...props }) {
  return <Image src={src} alt={alt} loader={nextLoader} {...props} />;
}
```

### 2. Vite/React Configuration

#### `.env` (All environments)
```bash
# Snapkit CDN
VITE_IMAGE_CDN_PROVIDER=snapkit
VITE_SNAPKIT_ORGANIZATION=my-react-app

# Optimization settings
VITE_IMAGE_DEFAULT_QUALITY=85
VITE_IMAGE_DEFAULT_FORMAT=webp
```

#### `.env.production`
```bash
# Override for production
VITE_IMAGE_CDN_PROVIDER=custom
VITE_IMAGE_CDN_URL=https://cdn.myapp.com
VITE_IMAGE_DEFAULT_QUALITY=90
```

#### Usage in Vite/React
```typescript
// src/lib/image-engine.ts
import { getCdnConfig, SnapkitImageEngine } from '@snapkit-studio/core';

// Automatically detects Vite environment and reads VITE_ variables
const cdnConfig = getCdnConfig();

export const imageEngine = new SnapkitImageEngine({
  cdnConfig,
  defaultQuality: parseInt(import.meta.env.VITE_IMAGE_DEFAULT_QUALITY || '85'),
  defaultFormat: import.meta.env.VITE_IMAGE_DEFAULT_FORMAT || 'auto',
});

// src/components/ResponsiveImage.tsx
import { imageEngine } from '../lib/image-engine';

export function ResponsiveImage({ src, width, height, alt, ...props }) {
  const imageData = imageEngine.generateImageData({
    src,
    width,
    height,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  });

  return (
    <img
      src={imageData.url}
      srcSet={imageData.srcSet}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
}
```

### 3. Node.js/Express Configuration

#### `.env`
```bash
# Server-side configuration
IMAGE_CDN_PROVIDER=snapkit
SNAPKIT_ORGANIZATION=my-server-app

# Image processing settings
IMAGE_DEFAULT_QUALITY=80
IMAGE_DEFAULT_FORMAT=auto
IMAGE_CACHE_TTL=3600
```

#### Usage in Node.js
```typescript
// config/image-config.ts
import { getCdnConfig, SnapkitImageEngine } from '@snapkit-studio/core';

// Automatically detects Node.js environment and reads standard variables
const cdnConfig = getCdnConfig();

export const imageEngine = new SnapkitImageEngine({
  cdnConfig,
  defaultQuality: parseInt(process.env.IMAGE_DEFAULT_QUALITY || '80'),
  defaultFormat: (process.env.IMAGE_DEFAULT_FORMAT as any) || 'auto',
});

// routes/images.ts
import express from 'express';
import { imageEngine } from '../config/image-config';

const router = express.Router();

router.get('/optimize', (req, res) => {
  const { src, width, height, quality } = req.query;

  const imageData = imageEngine.generateImageData({
    src: src as string,
    width: width ? parseInt(width as string) : undefined,
    height: height ? parseInt(height as string) : undefined,
    quality: quality ? parseInt(quality as string) : undefined,
  });

  res.json({
    url: imageData.url,
    srcSet: imageData.srcSet,
    transforms: imageData.transforms,
  });
});

export default router;
```

## CDN Provider Configurations

### AWS CloudFront Setup

#### Environment Configuration
```bash
# CloudFront CDN
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://d1234567890.cloudfront.net

# CloudFront-specific optimizations
IMAGE_DEFAULT_QUALITY=85
IMAGE_DEFAULT_FORMAT=webp
```

#### CloudFront Distribution Setup
1. Create a CloudFront distribution pointing to your S3 bucket
2. Configure origin request policy for query string forwarding
3. Set up cache behaviors for image optimization parameters
4. Enable compression and HTTP/2 support

```typescript
// CloudFront-optimized configuration
const cloudFrontEngine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'custom',
    baseUrl: process.env.IMAGE_CDN_URL!,
  },
  defaultQuality: 85,
  defaultFormat: 'webp',
});

// Generate CloudFront-compatible URLs
const imageData = cloudFrontEngine.generateImageData({
  src: '/images/product.jpg',
  width: 800,
  height: 600,
  transforms: {
    fit: 'cover',
    quality: 90,
  },
});
```

### Google Cloud Storage Setup

#### Environment Configuration
```bash
# Google Cloud Storage
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://storage.googleapis.com/my-image-bucket

# GCS-specific settings
IMAGE_DEFAULT_QUALITY=80
IMAGE_DEFAULT_FORMAT=auto
```

#### GCS Bucket Configuration
```typescript
// GCS-optimized configuration
const gcsEngine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'custom',
    baseUrl: process.env.IMAGE_CDN_URL!,
  },
  defaultQuality: 80,
  defaultFormat: 'auto',
});

// For GCS with Cloud CDN
const gcsWithCdnEngine = new SnapkitImageEngine({
  cdnConfig: {
    provider: 'custom',
    baseUrl: 'https://cdn.example.com', // Your Cloud CDN endpoint
  },
  defaultQuality: 85,
  defaultFormat: 'webp',
});
```

### Cloudflare Images Setup

#### Environment Configuration
```bash
# Cloudflare Images
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://imagedelivery.net/your-account-hash

# Cloudflare-specific settings
IMAGE_DEFAULT_QUALITY=85
IMAGE_DEFAULT_FORMAT=auto
```

## Multi-Environment Configuration

### Development vs Production

#### Development Configuration
```bash
# .env.development
IMAGE_CDN_PROVIDER=snapkit
SNAPKIT_ORGANIZATION=my-app-dev
IMAGE_DEFAULT_QUALITY=75  # Lower quality for faster development
IMAGE_DEFAULT_FORMAT=auto
```

#### Staging Configuration
```bash
# .env.staging
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://staging-cdn.example.com
IMAGE_DEFAULT_QUALITY=80
IMAGE_DEFAULT_FORMAT=webp
```

#### Production Configuration
```bash
# .env.production
IMAGE_CDN_PROVIDER=custom
IMAGE_CDN_URL=https://cdn.example.com
IMAGE_DEFAULT_QUALITY=90  # Higher quality for production
IMAGE_DEFAULT_FORMAT=auto # Auto-detect best format
```

### Docker Configuration

#### Dockerfile
```dockerfile
FROM node:18-alpine

# Set environment variables
ENV IMAGE_CDN_PROVIDER=custom
ENV IMAGE_CDN_URL=https://cdn.example.com
ENV IMAGE_DEFAULT_QUALITY=85

# ... rest of Dockerfile
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - IMAGE_CDN_PROVIDER=snapkit
      - SNAPKIT_ORGANIZATION=my-app
      - IMAGE_DEFAULT_QUALITY=85
      - IMAGE_DEFAULT_FORMAT=auto
    # Or use env_file:
    env_file:
      - .env.docker
```

#### .env.docker
```bash
IMAGE_CDN_PROVIDER=snapkit
SNAPKIT_ORGANIZATION=my-docker-app
IMAGE_DEFAULT_QUALITY=85
IMAGE_DEFAULT_FORMAT=auto
```

## CI/CD Configuration

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup environment
        run: |
          echo "IMAGE_CDN_PROVIDER=custom" >> .env.production
          echo "IMAGE_CDN_URL=${{ secrets.CDN_URL }}" >> .env.production
          echo "IMAGE_DEFAULT_QUALITY=90" >> .env.production

      - name: Build and deploy
        run: npm run build
        env:
          NEXT_PUBLIC_IMAGE_CDN_PROVIDER: custom
          NEXT_PUBLIC_IMAGE_CDN_URL: ${{ secrets.CDN_URL }}
```

### Vercel
```bash
# Vercel environment variables
NEXT_PUBLIC_IMAGE_CDN_PROVIDER=custom
NEXT_PUBLIC_IMAGE_CDN_URL=https://cdn.example.com
NEXT_PUBLIC_IMAGE_DEFAULT_QUALITY=90
```

### Netlify
```bash
# Netlify environment variables
VITE_IMAGE_CDN_PROVIDER=custom
VITE_IMAGE_CDN_URL=https://cdn.example.com
VITE_IMAGE_DEFAULT_QUALITY=85
```

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
```typescript
// Debug environment detection
import { getEnvironmentDebugInfo } from '@snapkit-studio/core';

console.log('Environment debug info:', getEnvironmentDebugInfo());
// Shows detected strategy and available variables
```

#### 2. Invalid Configuration
```typescript
// Validate configuration before use
import { getCdnConfig } from '@snapkit-studio/core';

try {
  const config = getCdnConfig();
  console.log('Valid configuration:', config);
} catch (error) {
  console.error('Configuration error:', error.message);
  // Handle fallback configuration
}
```

#### 3. Framework Detection Issues
```typescript
// Manual strategy specification
import { getCdnConfig, environmentStrategies } from '@snapkit-studio/core';

// Force specific strategy
const nextjsStrategy = environmentStrategies.find(s => s.name === 'nextjs');
const config = getCdnConfig(nextjsStrategy);
```

### Environment Variable Validation

```typescript
// Validation helper
function validateEnvironmentConfig() {
  const requiredVars = {
    'IMAGE_CDN_PROVIDER': process.env.IMAGE_CDN_PROVIDER,
  };

  if (requiredVars.IMAGE_CDN_PROVIDER === 'snapkit') {
    requiredVars['SNAPKIT_ORGANIZATION'] = process.env.SNAPKIT_ORGANIZATION;
  }

  if (requiredVars.IMAGE_CDN_PROVIDER === 'custom') {
    requiredVars['IMAGE_CDN_URL'] = process.env.IMAGE_CDN_URL;
  }

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Use in application startup
try {
  validateEnvironmentConfig();
  console.log('✅ Environment configuration is valid');
} catch (error) {
  console.error('❌ Environment configuration error:', error.message);
  process.exit(1);
}
```

## Best Practices

1. **Use Framework-Specific Prefixes**: Always use the correct prefix for your framework
2. **Separate Environments**: Use different `.env` files for different environments
3. **Secure Sensitive Values**: Use CI/CD secrets for sensitive configuration values
4. **Validate on Startup**: Validate environment configuration when your application starts
5. **Provide Fallbacks**: Have reasonable fallback values for non-critical settings
6. **Document Variables**: Document all environment variables your application uses
7. **Use Type Safety**: Create typed configuration objects from environment variables