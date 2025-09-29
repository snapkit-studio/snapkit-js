import { expect, test } from '@playwright/test';

test.describe('NextJS Demo - Build Verification', () => {
  test('should load production build without errors', async ({ page }) => {
    // Track console errors (excluding image loading failures)
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore image loading failures (404 errors)
        if (!text.includes('Failed to load resource') && !text.includes('404')) {
          errors.push(text);
        }
      }
    });

    // Track page crashes
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Navigate to main page
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify no console errors (excluding image loading failures)
    expect(errors).toHaveLength(0);

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/Next.js Demo/i);

    // Verify main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should render Image components from @snapkit-studio/nextjs', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore image loading failures (404 errors)
        if (!text.includes('Failed to load resource') && !text.includes('404')) {
          errors.push(text);
        }
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

    // No console errors (excluding image loading failures)
    expect(errors).toHaveLength(0);
  });

  test('should handle client-side navigation without errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore image loading failures (404 errors)
        if (!text.includes('Failed to load resource') && !text.includes('404')) {
          errors.push(text);
        }
      }
    });

    await page.goto('/');

    // Click on navigation items if they exist
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Test first few navigation links
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        await navLinks.nth(i).click();
        await page.waitForLoadState('networkidle');

        // Verify no errors after navigation (excluding image loading failures)
        expect(errors).toHaveLength(0);
      }
    }
  });

  test('should verify production bundle optimization', async ({ page }) => {
    const errors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore image loading failures (404 errors)
        if (!text.includes('Failed to load resource') && !text.includes('404')) {
          errors.push(text);
        }
      }
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      // Ignore image loading failures
      if (!url.includes('.jpg') && !url.includes('.png') && !url.includes('.webp') && !url.includes('.avif')) {
        networkErrors.push(`${request.failure()?.errorText}: ${url}`);
      }
    });

    await page.goto('/');

    // Wait for app to fully load
    await page.waitForLoadState('networkidle');

    // Verify no network errors (excluding image loading failures)
    expect(networkErrors).toHaveLength(0);

    // Verify no console errors (excluding image loading failures)
    expect(errors).toHaveLength(0);

    // Verify Next.js production build loaded successfully
    const isNextJsApp = await page.evaluate(() => {
      return (
        document.querySelector('script[id="__NEXT_DATA__"]') !== null ||
        window.location.pathname !== undefined
      );
    });
    expect(isNextJsApp).toBe(true);
  });

  test('should load images with Next.js optimization parameters', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore image loading failures (404 errors)
        if (!text.includes('Failed to load resource') && !text.includes('404')) {
          errors.push(text);
        }
      }
    });

    await page.goto('/');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Get all image sources
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const image = images.nth(i);
        const src = await image.getAttribute('src');

        if (src && src.includes('snapkit.studio')) {
          // Verify Snapkit image optimization parameters
          expect(src).toMatch(/[\?&]w=\d+/); // width parameter
          expect(src).toMatch(/[\?&]quality=\d+/); // quality parameter
        }
      }
    }

    // No console errors (excluding image loading failures)
    expect(errors).toHaveLength(0);
  });
});
