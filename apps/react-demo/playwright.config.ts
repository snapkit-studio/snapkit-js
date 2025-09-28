/* eslint-disable turbo/no-undeclared-env-vars */
import { defineConfig, devices } from '@playwright/test';

/**
 * React Demo E2E test configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests sequentially to avoid resource conflicts */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use fewer workers on CI to avoid resource conflicts */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all tests. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL for the React demo app */
    baseURL: 'http://localhost:3011',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    /* Browser settings for React app testing */
    ...devices['Desktop Chrome'],
  },

  /* Configure projects for React demo */
  projects: [
    {
      name: 'react-demo',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Run Vite production build before starting the tests */
  webServer: {
    command: 'pnpm build && pnpm preview --port 3011',
    port: 3011,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
