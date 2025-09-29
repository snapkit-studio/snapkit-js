/**
 * @fileoverview Basic usage examples for @snapkit-studio/core
 *
 * This file demonstrates the fundamental features of the Snapkit Core library
 * including CDN provider configuration, URL building, and image optimization.
 */

import {
  SnapkitImageEngine,
  SnapkitUrlBuilder,
  UrlBuilderFactory,
  getCdnConfig,
  type CdnConfig,
  type SnapkitConfig,
} from '@snapkit-studio/core';

// =============================================================================
// CDN Configuration Examples
// =============================================================================

/**
 * Example 1: Snapkit CDN Configuration
 *
 * Use Snapkit's optimized CDN for automatic image optimization,
 * smart format delivery, and global edge caching.
 */
function exampleSnapkitCdnConfig() {
  const snapkitConfig: SnapkitConfig = {
    cdnConfig: {
      provider: 'snapkit',
      organizationName: 'my-company',
    },
    defaultQuality: 85,
    defaultFormat: 'auto', // Automatically selects best format
  };

  const engine = new SnapkitImageEngine(snapkitConfig);

  // Generate basic optimized URL
  const imageData = engine.generateImageData({
    src: '/products/laptop.jpg',
    width: 800,
    height: 600,
  });

  console.log('Snapkit CDN URL:', imageData.url);
  // Output: https://my-company-cdn.snapkit.studio/products/laptop.jpg?w=800&h=600&quality=85&format=auto
}

/**
 * Example 2: Custom CDN Configuration - AWS CloudFront
 *
 * Use your existing CloudFront distribution for image delivery
 * while leveraging Snapkit's optimization features.
 */
function exampleCloudFrontConfig() {
  const cloudFrontConfig: SnapkitConfig = {
    cdnConfig: {
      provider: 'custom',
      baseUrl: 'https://d1234567890.cloudfront.net',
    },
    defaultQuality: 90,
    defaultFormat: 'webp',
  };

  const engine = new SnapkitImageEngine(cloudFrontConfig);

  const imageData = engine.generateImageData({
    src: '/images/hero-banner.jpg',
    width: 1920,
    height: 1080,
    quality: 85,
  });

  console.log('CloudFront CDN URL:', imageData.url);
  // Output: https://d1234567890.cloudfront.net/images/hero-banner.jpg?w=1920&h=1080&quality=85&format=webp
}

/**
 * Example 3: Google Cloud Storage Configuration
 *
 * Integrate with Google Cloud Storage buckets for image delivery.
 */
function exampleGoogleCloudStorageConfig() {
  const gcsConfig: SnapkitConfig = {
    cdnConfig: {
      provider: 'custom',
      baseUrl: 'https://storage.googleapis.com/my-image-bucket',
    },
    defaultQuality: 80,
    defaultFormat: 'auto',
  };

  const engine = new SnapkitImageEngine(gcsConfig);

  const imageData = engine.generateImageData({
    src: '/gallery/vacation-2024/beach.jpg',
    width: 1200,
    height: 800,
    transforms: {
      fit: 'cover',
      blur: 5,
    },
  });

  console.log('Google Cloud Storage URL:', imageData.url);
  // Output: https://storage.googleapis.com/my-image-bucket/gallery/vacation-2024/beach.jpg?w=1200&h=800&quality=80&format=auto&fit=cover&blur=5
}

// =============================================================================
// Environment-Based Configuration
// =============================================================================

/**
 * Example 4: Automatic Environment Detection
 *
 * Automatically detect the current environment (Node.js, Vite, Next.js, etc.)
 * and load appropriate environment variables.
 */
function exampleEnvironmentDetection() {
  // This automatically detects your environment and reads the correct env vars
  // Next.js: NEXT_PUBLIC_IMAGE_CDN_PROVIDER, NEXT_PUBLIC_SNAPKIT_ORGANIZATION
  // Vite: VITE_IMAGE_CDN_PROVIDER, VITE_SNAPKIT_ORGANIZATION
  // Node.js: IMAGE_CDN_PROVIDER, SNAPKIT_ORGANIZATION

  try {
    const cdnConfig = getCdnConfig();
    console.log('Auto-detected CDN config:', cdnConfig);

    const engine = new SnapkitImageEngine({
      cdnConfig,
      defaultQuality: 85,
      defaultFormat: 'auto',
    });

    // Use the engine as normal
    const imageData = engine.generateImageData({
      src: '/assets/logo.png',
      width: 200,
      height: 100,
    });

    console.log('Environment-based URL:', imageData.url);
  } catch (error) {
    console.error('Environment configuration error:', error.message);
    // Fallback to manual configuration
  }
}

// =============================================================================
// URL Builder Examples
// =============================================================================

/**
 * Example 5: Direct URL Building
 *
 * Use the URL builder directly for more control over URL generation.
 */
function exampleUrlBuilder() {
  // Using factory (recommended for performance due to caching)
  const builder = UrlBuilderFactory.getInstance({
    provider: 'snapkit',
    organizationName: 'demo-org',
  });

  // Basic image URL
  const basicUrl = builder.buildImageUrl('/photos/sunset.jpg');
  console.log('Basic URL:', basicUrl);
  // Output: https://demo-org-cdn.snapkit.studio/photos/sunset.jpg

  // URL with transformations
  const transformedUrl = builder.buildTransformedUrl('/photos/sunset.jpg', {
    width: 800,
    height: 600,
    quality: 90,
    format: 'webp',
    fit: 'cover',
    blur: 10,
    grayscale: true,
  });
  console.log('Transformed URL:', transformedUrl);
  // Output: https://demo-org-cdn.snapkit.studio/photos/sunset.jpg?w=800&h=600&quality=90&format=webp&fit=cover&blur=10&grayscale=true

  // Generate srcSet for responsive images
  const srcSet = builder.buildSrcSet('/photos/sunset.jpg', [400, 800, 1200], {
    quality: 85,
    format: 'webp',
  });
  console.log('SrcSet:', srcSet);
  // Output: "https://demo-org-cdn.snapkit.studio/photos/sunset.jpg?w=400&quality=85&format=webp 400w, ..."

  // Generate format URLs for picture element
  const formatUrls = builder.buildFormatUrls('/photos/sunset.jpg', {
    width: 800,
    height: 600,
    quality: 85,
  });
  console.log('Format URLs:', formatUrls);
  // Output: {
  //   avif: "https://demo-org-cdn.snapkit.studio/photos/sunset.jpg?w=800&h=600&format=avif&quality=85",
  //   webp: "https://demo-org-cdn.snapkit.studio/photos/sunset.jpg?w=800&h=600&format=webp&quality=85",
  //   original: "https://demo-org-cdn.snapkit.studio/photos/sunset.jpg?w=800&h=600&quality=85"
  // }
}

// =============================================================================
// Advanced Image Generation
// =============================================================================

/**
 * Example 6: Responsive Image Generation
 *
 * Generate responsive images with automatic srcSet and sizes calculation.
 */
function exampleResponsiveImages() {
  const engine = new SnapkitImageEngine({
    cdnConfig: {
      provider: 'snapkit',
      organizationName: 'responsive-demo',
    },
    defaultQuality: 85,
    defaultFormat: 'auto',
  });

  // Responsive image with sizes attribute
  const responsiveData = engine.generateImageData({
    src: '/blog/article-hero.jpg',
    width: 800,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  });

  console.log('Responsive image data:', {
    url: responsiveData.url,
    srcSet: responsiveData.srcSet,
    size: responsiveData.size,
    transforms: responsiveData.transforms,
  });

  // Fill mode for hero images
  const heroData = engine.generateImageData({
    src: '/homepage/hero-background.jpg',
    fill: true, // Uses default fill width of 1920px
    quality: 95,
  });

  console.log('Hero image (fill mode):', heroData);
}

/**
 * Example 7: Next.js Integration
 *
 * Create a loader function for Next.js Image components.
 */
function exampleNextJsIntegration() {
  const engine = new SnapkitImageEngine({
    cdnConfig: {
      provider: 'custom',
      baseUrl: 'https://cdn.example.com',
    },
    defaultQuality: 85,
    defaultFormat: 'auto',
  });

  // Create Next.js compatible loader
  const nextLoader = engine.createNextJsLoader();

  // Example of how to use with Next.js Image component:
  /*
  import Image from 'next/image';

  function MyComponent() {
    return (
      <Image
        src="/photos/product.jpg"
        alt="Product image"
        width={800}
        height={600}
        loader={nextLoader}
        quality={90}
      />
    );
  }
  */

  // Test the loader function
  const nextJsUrl = nextLoader({
    src: '/photos/product.jpg',
    width: 800,
    quality: 90,
  });

  console.log('Next.js loader URL:', nextJsUrl);
  // Output: https://cdn.example.com/photos/product.jpg?w=800&quality=90&format=auto
}

// =============================================================================
// Error Handling and Validation
// =============================================================================

/**
 * Example 8: Configuration Validation and Error Handling
 *
 * Demonstrate proper error handling and configuration validation.
 */
function exampleErrorHandling() {
  console.log('\n=== Configuration Validation Examples ===');

  // Invalid Snapkit configuration (missing organizationName)
  try {
    const invalidConfig: SnapkitConfig = {
      cdnConfig: {
        provider: 'snapkit',
        // Missing organizationName
      } as any,
      defaultQuality: 85,
      defaultFormat: 'auto',
    };

    const engine = new SnapkitImageEngine(invalidConfig);
    console.log('This should not execute');
  } catch (error) {
    console.log('✓ Caught expected error:', error.message);
    // Expected: "organizationName is required when using snapkit provider"
  }

  // Invalid custom configuration (missing baseUrl)
  try {
    const invalidCustomConfig: SnapkitConfig = {
      cdnConfig: {
        provider: 'custom',
        // Missing baseUrl
      } as any,
      defaultQuality: 85,
      defaultFormat: 'auto',
    };

    const engine = new SnapkitImageEngine(invalidCustomConfig);
    console.log('This should not execute');
  } catch (error) {
    console.log('✓ Caught expected error:', error.message);
    // Expected: "baseUrl is required when using custom provider"
  }

  // Invalid image parameters
  const validEngine = new SnapkitImageEngine({
    cdnConfig: {
      provider: 'snapkit',
      organizationName: 'test-org',
    },
    defaultQuality: 85,
    defaultFormat: 'auto',
  });

  // Validate parameters before generating
  const invalidParams = {
    src: '', // Empty src
    width: -100, // Negative width
    quality: 150, // Invalid quality
  };

  const validation = validEngine.validateParams(invalidParams);
  console.log('Parameter validation:', validation);
  // Output: { isValid: false, errors: ["src must be a non-empty string", "width must be a positive number", "quality must be a number between 1 and 100"] }

  if (!validation.isValid) {
    console.log('❌ Invalid parameters:', validation.errors);
  }
}

// =============================================================================
// Run Examples
// =============================================================================

/**
 * Main function to run all examples
 */
function runAllExamples() {
  console.log('🚀 @snapkit-studio/core Basic Usage Examples\n');

  console.log('1. Snapkit CDN Configuration:');
  exampleSnapkitCdnConfig();

  console.log('\n2. CloudFront Configuration:');
  exampleCloudFrontConfig();

  console.log('\n3. Google Cloud Storage Configuration:');
  exampleGoogleCloudStorageConfig();

  console.log('\n4. Environment Detection:');
  exampleEnvironmentDetection();

  console.log('\n5. URL Builder:');
  exampleUrlBuilder();

  console.log('\n6. Responsive Images:');
  exampleResponsiveImages();

  console.log('\n7. Next.js Integration:');
  exampleNextJsIntegration();

  console.log('\n8. Error Handling:');
  exampleErrorHandling();

  console.log('\n✅ All examples completed!');
}

// Export functions for individual testing
export {
  exampleSnapkitCdnConfig,
  exampleCloudFrontConfig,
  exampleGoogleCloudStorageConfig,
  exampleEnvironmentDetection,
  exampleUrlBuilder,
  exampleResponsiveImages,
  exampleNextJsIntegration,
  exampleErrorHandling,
  runAllExamples,
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}