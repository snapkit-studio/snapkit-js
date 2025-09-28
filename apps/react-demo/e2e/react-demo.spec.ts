import { test, expect } from '@playwright/test';

test.describe('React Demo - Build Verification', () => {
  test('should load Vite production build without errors', async ({ page }) => {
    // Track console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Track page crashes
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    // Navigate to main page
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify no console errors
    expect(errors).toHaveLength(0);

    // Verify React app mounted (check for any content in body)
    const bodyContent = page.locator('body');
    await expect(bodyContent).toBeVisible();

    // Verify page has some content
    const hasContent = await page.evaluate(() => {
      return document.body.children.length > 0;
    });
    expect(hasContent).toBe(true);
  });

  test('should render Image components from @snapkit-studio/react', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for images to render
    const images = page.locator('img');
    await expect(images.first()).toBeVisible({ timeout: 10000 });

    // Verify at least one image loaded
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    // Verify images have src attribute
    const firstImage = images.first();
    const src = await firstImage.getAttribute('src');
    expect(src).toBeTruthy();

    // Verify Snapkit transformation is applied
    expect(src).toContain('snapkit.studio');

    // No console errors
    expect(errors).toHaveLength(0);
  });

  test('should verify production bundle loads correctly', async ({ page }) => {
    const errors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('requestfailed', request => {
      networkErrors.push(`${request.failure()?.errorText}: ${request.url()}`);
    });

    await page.goto('/');

    // Wait for app to fully load
    await page.waitForLoadState('networkidle');

    // Verify no network errors (404s, etc)
    expect(networkErrors).toHaveLength(0);

    // Verify no console errors
    expect(errors).toHaveLength(0);

    // Verify JavaScript executed (React hydrated)
    const isInteractive = await page.evaluate(() => {
      return document.querySelector('#root')?.children.length > 0;
    });
    expect(isInteractive).toBe(true);
  });

  test('should handle Vite production bundle optimization', async ({ page }) => {
    const errors: string[] = [];
    const jsRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('request', request => {
      if (request.url().endsWith('.js') && !request.url().includes('node_modules')) {
        jsRequests.push(request.url());
      }
    });

    await page.goto('/');

    // Wait for app to fully load
    await page.waitForLoadState('networkidle');

    // Verify no console errors
    expect(errors).toHaveLength(0);

    // Vite should create optimized bundles (allow more chunks for complex build)
    expect(jsRequests.length).toBeLessThan(30); // Should have reasonable number of chunks
    expect(jsRequests.length).toBeGreaterThan(0); // Should have at least one JS bundle
  });

  test('should verify React components render without runtime errors', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
      if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for React to mount and hydrate
    await page.waitForLoadState('networkidle');

    // Verify no React errors
    expect(errors).toHaveLength(0);

    // Check for React-specific warnings (but don't fail on them)
    const reactWarnings = warnings.filter(warning =>
      warning.includes('React') || warning.includes('Warning:')
    );

    // Log warnings for debugging but don't fail the test
    if (reactWarnings.length > 0) {
      console.log('React warnings found:', reactWarnings);
    }

    // Verify app is interactive and has content
    const hasContent = await page.evaluate(() => {
      return document.body.children.length > 0;
    });
    expect(hasContent).toBe(true);
  });

  test('should load and display demo content correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Verify main heading or content exists
    const hasHeading = await page.locator('h1').count() > 0;
    const hasContent = await page.locator('#root > *').count() > 0;

    expect(hasHeading || hasContent).toBe(true);

    // Verify no console errors during content rendering
    expect(errors).toHaveLength(0);

    // Verify page is interactive
    const isInteractive = await page.evaluate(() => {
      const root = document.querySelector('#root');
      return root && root.children.length > 0;
    });
    expect(isInteractive).toBe(true);
  });
});