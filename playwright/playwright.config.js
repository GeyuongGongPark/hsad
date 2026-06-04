import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['**/*.spec.js'],
  timeout: 60000,
  use: {
    channel: 'chrome',
    headless: true,
  },
});
