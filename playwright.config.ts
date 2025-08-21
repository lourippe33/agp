import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'expo start --web --non-interactive',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  timeout: 60000,
  use: { 
    headless: true,
    baseURL: 'http://localhost:8081'
  },
  testDir: './tests',
  reporter: 'line'
});