import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  outputDir: 'test-results',
  reporter: [['list'], ['html', { outputFolder: 'reports/playwright-report', open: 'never' }]],
  snapshotPathTemplate: 'e2e/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' },
    },
    {
      name: 'tablet-chromium',
      testMatch: '**/08-visual.spec.ts',
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
