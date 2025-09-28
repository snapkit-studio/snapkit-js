# Snapkit

Next-generation image optimization for React and Next.js applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## Overview

Drop-in image optimization with automatic format conversion (AVIF/WebP), lazy loading, and responsive images. Zero-config for Next.js, minimal setup for React.

### 🚧 React Server Components (RSC) Status

#### Next.js Package

- The `@snapkit-studio/nextjs` `Image` component is currently **client-only**.
- RSC 및 서버 컴포넌트 환경에서는 직접 사용할 수 없으며, `'use client'` 지시자가 필요합니다.
- 향후 RSC 지원을 준비하면서도 기존 Next.js Image 통합 흐름은 유지됩니다.

#### React Package

- **Framework-agnostic RSC support** - works in any React 18+ environment
- **ServerImage and ClientImage components** for explicit control
- **Smaller bundle size** without Next.js dependencies
- **Consistent explicit component selection** approach

## Packages

| Package                                       | Size  | Description                                     |
| --------------------------------------------- | ----- | ----------------------------------------------- |
| [`@snapkit-studio/nextjs`](./packages/nextjs) | ~15KB | Next.js Image component with zero configuration |
| [`@snapkit-studio/react`](./packages/react)   | ~9KB  | Lightweight React Image component               |
| [`@snapkit-studio/core`](./packages/core)     | ~5KB  | Core utilities for custom implementations       |

## Quick Start

### Next.js (Zero Config)

```bash
npm install @snapkit-studio/nextjs
```

```bash
# .env.local
NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-organization-name
```

```tsx
'use client';

// app/page.tsx - The Image component must run on the client
import { Image } from '@snapkit-studio/nextjs';

export default function Page() {
  return (
    <>
      <Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

      <Image
        src="/interactive.jpg"
        alt="Interactive"
        width={800}
        height={400}
        onLoad={() => console.log('Loaded!')}
      />
    </>
  );
}
```

### React (Vite/CRA)

```bash
npm install @snapkit-studio/react
```

```bash
# .env
VITE_SNAPKIT_ORGANIZATION_NAME=your-organization-name
```

```tsx
// App.tsx - Use explicit components for optimal control
import { ServerImage, ClientImage } from '@snapkit-studio/react';

function App() {
  return (
    <>
      {/* Explicit ServerImage for RSC environments */}
      <ServerImage
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        transforms={{ format: 'auto' }}
      />

      {/* Explicit ClientImage for interactive features */}
      <ClientImage
        src="/interactive.jpg"
        alt="Interactive"
        width={800}
        height={400}
        onLoad={() => console.log('Loaded!')}
        adjustQualityByNetwork={true}
      />
    </>
  );
}
```

## Features Comparison

| Feature                      | @snapkit-studio/nextjs         | @snapkit-studio/react |
| ---------------------------- | ------------------------------ | --------------------- |
| React Server Components      | ❌ Client component only        | ✅ Native support     |
| Explicit Component Selection | ❌ Single `Image` component     | ✅ ServerImage/ClientImage |
| Next.js Image Integration    | ✅ Native                      | ❌                    |
| Bundle Size                  | ~15KB                          | ~9KB                  |
| Error Boundaries             | ✅                             | ✅ ImageErrorBoundary |
| Network-aware Quality        | ✅                             | ✅                    |
| DPR Optimization             | ✅                             | ✅                    |
| Provider Required            | ❌                             | ❌                    |

## Environment Variables

### Next.js

| Variable                                      | Default  | Description                                   |
| --------------------------------------------- | -------- | --------------------------------------------- |
| `NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME`       | Required | Your Snapkit organization name                |
| `NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY`         | `85`     | Default image quality (1-100)                 |
| `NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT` | `auto`   | Default format: `auto`, `avif`, `webp`, `off` |

### React (Vite/CRA)

| Variable                               | Default  | Description                                   |
| -------------------------------------- | -------- | --------------------------------------------- |
| `VITE_SNAPKIT_ORGANIZATION_NAME`       | Required | Your Snapkit organization name                |
| `VITE_SNAPKIT_DEFAULT_QUALITY`         | `85`     | Default image quality (1-100)                 |
| `VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT` | `auto`   | Default format: `auto`, `avif`, `webp`, `off` |

## Live Demos

- **Next.js Demo**: [https://nextjs.snapkit.studio](https://nextjs.snapkit.studio) - Server/Client components, DPR optimization ([Source](./apps/nextjs-demo))
- **React Demo**: [https://react.snapkit.studio](https://react.snapkit.studio) - Error boundaries, network adaptation, transforms ([Source](./apps/react-demo))

## Testing

The project maintains comprehensive test coverage across all packages:

```bash
# Run all tests
pnpm exec turbo test

# Run tests with coverage
pnpm exec turbo test:coverage
```

### Test Coverage Standards

All packages maintain consistent coverage standards:

- **Coverage Threshold**: 80% minimum for branches, functions, lines, and statements
- **Test Framework**: Vitest with v8 coverage provider
- **Coverage Reports**: Text (console), JSON, HTML, and LCOV formats

## Development

```bash
pnpm install          # Install dependencies
pnpm exec turbo dev   # Start development
pnpm exec turbo build # Build packages
pnpm exec turbo test  # Run tests

# Run specific demo apps
pnpm exec turbo dev --filter nextjs-demo  # Next.js demo at http://localhost:3000
pnpm exec turbo dev --filter react-demo   # React demo at http://localhost:5173
```

## License

MIT
