import { devices, type PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// Determine reporter configuration:
// - CI or E2E_REPORTER=ci: JUnit for test results parsing + HTML for artifacts
// - E2E_REPORTER=list: Simple list output (good for CLI tools like Claude Code)
// - Default: HTML report with auto-open on failure
const getReporter = (): PlaywrightTestConfig['reporter'] => {
  if (process.env.CI || process.env.E2E_REPORTER === 'ci') {
    return [
      ['junit', { outputFile: 'results.xml' }],
      ['html', { open: 'never' }],
    ];
  }
  if (process.env.E2E_REPORTER === 'list') {
    return [['list'], ['html', { open: 'never' }]];
  }
  return [['html']];
};

// See https://playwright.dev/docs/test-configuration.
const config: PlaywrightTestConfig = {
  testDir: './e2e/specs',
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 40 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: getReporter(),
  globalSetup: require.resolve('./e2e/core/global-setup'),
  use: {
    baseURL: `${process.env.E2E_BASE_URL}/spa/`,
    storageState: 'e2e/storageState.json',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
};

export default config;
