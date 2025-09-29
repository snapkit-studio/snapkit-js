# React Demo - Snapkit Image Component Showcase

Interactive demonstration app showcasing all features of the @snapkit-studio/react Image component. This demo provides live examples of image optimization capabilities with real-time code examples.

## Features Demonstrated

### 🖼️ Core Image Features

- **DPR-based Srcset** - Automatic 1x, 2x, 3x versions for crisp displays
- **Fill Mode** - Container-filling responsive images
- **Image Transformations** - Format optimization, visual effects, region extraction
- **Format Optimization** - AVIF, WebP, auto-detection examples

### ⚡ Performance Optimization

- **Lazy Loading** - Intersection Observer based loading
- **Priority Loading** - Immediate loading for above-the-fold content
- **Network-aware Quality** - Dynamic quality adjustment

### 🎯 Advanced Patterns

- **Error Boundaries** - Graceful error handling with ImageErrorBoundary
- **Art Direction** - Different compositions for different screen sizes
- **Custom Transforms** - Real-time image effects and cropping
- **Quality Controls** - Network-optimized image delivery

## Quick Start

### Development Server

```bash
# From project root
pnpm dev:react-demo

# Or from demo directory
cd apps/react-demo
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the demo.

### Building for Production

```bash
# Build the demo
npm run build

# Preview production build
npm run preview
```

## Demo Structure

### Core Components

- **App.tsx** - Main demo application with feature sections
- **CodeBlock.tsx** - Syntax-highlighted code examples using Shiki

### Example Components

- **ImageErrorBoundaryExample.tsx** - Error boundary demonstrations with fallback UI

### Section Breakdown

#### 1. Basic Features

- **DPR Srcset Example**: Shows automatic generation of high-DPI versions
- **Fill Mode Example**: Demonstrates container-filling behavior
- **Image Transforms**: Live examples of format optimization, grayscale, and cropping

#### 2. Performance Optimization

- **Lazy Loading**: Scrollable container showing deferred image loading
- **Priority Loading**: Immediate loading demonstration for critical images with preload hints
- **Smart DPR Detection**: Automatic device pixel ratio optimization
- **Network-aware Quality**: Dynamic quality adjustment based on connection speed

#### 3. Advanced Patterns

- **Error Boundary Protection**: Graceful error handling with custom fallback UI
- **Art Direction**: Different aspect ratios for different contexts
- **Network-aware Quality**: Quality optimization based on connection speed
- **HOC Pattern**: Using withImageErrorBoundary for component wrapping

## Technical Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Fast development and build tooling
- **TypeScript** - Full type safety
- **@snapkit-studio/react** - Core image optimization components
- **Shiki** - Syntax highlighting for code examples
- **Tailwind CSS** - Utility-first styling (configured via classes)

## Configuration Files

### Vite Configuration (`vite.config.ts`)

```typescript
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
```

### TypeScript Configuration

- **tsconfig.json** - Main TypeScript configuration
- **tsconfig.node.json** - Node.js specific configuration for Vite

### ESLint Configuration (`eslint.config.js`)

```javascript
import { config } from '@repo/eslint-config/react-internal';

export default config;
```

## Image Assets

The demo uses sample images located at:

- `/landing-page/fox.jpg` - Primary demo image
- Images are served through Snapkit optimization pipeline

## Code Examples

### Basic Image Usage

```tsx
import { Image } from '@snapkit-studio/react';

<Image
  src="/landing-page/fox.jpg"
  alt="Optimized fox image"
  width={300}
  height={200}
  className="rounded-lg shadow-md object-contain"
/>;
```

### Error Boundary Protection

```tsx
import { Image, ImageErrorBoundary } from '@snapkit-studio/react';

<ImageErrorBoundary
  fallback={<CustomErrorFallback />}
  onError={(error, errorInfo) => console.error(error)}
>
  <Image
    src="/landing-page/fox.jpg"
    alt="Protected image"
    width={300}
    height={200}
  />
</ImageErrorBoundary>;
```

### Fill Mode with Container

```tsx
<div className="relative h-64 w-full overflow-hidden rounded-lg">
  <Image
    src="/landing-page/fox.jpg"
    alt="Fill mode example"
    fill={true}
    className="object-cover"
  />
</div>
```

### Image Transformations

```tsx
// Format optimization
<Image
  src="/landing-page/fox.jpg"
  alt="WebP optimized"
  width={300}
  height={200}
  transforms={{ format: 'webp' }}
/>

// Visual effects
<Image
  src="/landing-page/fox.jpg"
  alt="Grayscale effect"
  width={300}
  height={200}
  transforms={{ grayscale: true }}
/>

// Region extraction
<Image
  src="/landing-page/fox.jpg"
  alt="Center crop"
  width={300}
  height={200}
  transforms={{
    extract: { x: 25, y: 25, width: 50, height: 50 }
  }}
/>
```

### Performance Features

```tsx
// Priority loading for above-the-fold
<Image
  src="/landing-page/fox.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority={true}
  className="hero-image"
/>

// Lazy loading for below-the-fold
<Image
  src="/landing-page/fox.jpg"
  alt="Content image"
  width={400}
  height={300}
  loading="lazy"
/>
```

## Development Features

### Hot Module Replacement (HMR)

The demo includes fast refresh for immediate feedback during development.

### Type Safety

Full TypeScript integration with @snapkit-studio/react types.

### Code Highlighting

Live syntax highlighting for all code examples using Shiki with VS Code themes.

## Browser Testing

Test the following features in different browsers:

- **AVIF Support** - Chrome 85+, Firefox 93+, Safari 16+
- **WebP Support** - Chrome 23+, Firefox 65+, Safari 14+
- **Lazy Loading** - Chrome 76+, Firefox 75+, Safari 15.4+
- **Intersection Observer** - Chrome 58+, Firefox 55+, Safari 12.1+

## Performance Metrics

The demo showcases real performance benefits:

- **Faster Loading** - Optimized formats reduce file sizes by 30-70%
- **Better Core Web Vitals** - Priority loading improves LCP scores
- **Reduced Bandwidth** - Network-aware quality saves data on slow connections

## Running Tests

```bash
# Type checking
npm run check-types

# Linting
npm run lint

# Build verification
npm run build
```

## Deployment

The demo is designed to work with static hosting providers:

### Vercel

```bash
# Deploy to Vercel
vercel --prod
```

### Netlify

```bash
# Build and deploy
npm run build
netlify deploy --prod --dir dist
```

### GitHub Pages

```bash
# Build for GitHub Pages
npm run build
# Deploy dist/ folder to gh-pages branch
```

## Customization

### Adding New Examples

1. **Create new section in App.tsx**:

```tsx
<div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
  <h3 className="mb-6 text-2xl font-semibold text-gray-800">New Feature</h3>
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
    <div>
      <h4 className="mb-4 text-lg font-medium text-gray-700">Live Demo</h4>
      {/* Your demo here */}
    </div>
    <div>
      <h4 className="mb-4 text-lg font-medium text-gray-700">Implementation</h4>
      <CodeBlock language="tsx">{/* Your code example */}</CodeBlock>
    </div>
  </div>
</div>
```

2. **Update CodeBlock component** if needed for different syntax highlighting

3. **Add new demo images** to the public directory

### Styling Changes

The demo uses Tailwind CSS utility classes. Modify classes in JSX or add custom CSS:

```tsx
// Custom component styling
<Image
  src="/custom-image.jpg"
  alt="Custom styled"
  width={400}
  height={300}
  className="your-custom-classes"
/>
```

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check image paths in public directory
   - Verify Snapkit provider configuration
   - Check network requests in browser dev tools

2. **TypeScript errors**
   - Run `npm run check-types` to see detailed errors
   - Ensure @snapkit-studio/react is properly installed

3. **Build failures**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for ESLint errors: `npm run lint`

### Development Tips

- Use browser dev tools to inspect generated srcset attributes
- Check Network tab to see format optimization in action
- Use Lighthouse to measure performance improvements
- Test on different devices and network conditions

## Contributing

To add new demo features:

1. Fork the repository
2. Create a feature branch
3. Add your demo section to App.tsx
4. Include both live demo and code example
5. Test across different browsers
6. Submit a pull request

## Resources

- **Package Documentation**: [packages/react/README.md](../../packages/react/README.md)
- **Core Utilities**: [packages/core/README.md](../../packages/core/README.md)
- **Main Repository**: [README.md](../../README.md)
- **Snapkit Website**: [https://snapkit.studio](https://snapkit.studio)

## License

MIT - Same as parent project
