import { defineConfig } from '@playwright/test';

import config from './playwright.config';

export default defineConfig({
  ...config,
  testMatch: /(?:00|01|02|03|04|05|06|07|08|09|10|11|25|26)-.*\.spec\.ts/,
  reporter: [['list'], ['html', { outputFolder: 'reports/playwright-compat', open: 'never' }]],
  projects: [
    {
      name: 'desktop-firefox',
      use: { browserName: 'firefox', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
