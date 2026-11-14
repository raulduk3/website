import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PORTFOLIO_TEST_URL ?? "http://127.0.0.1:3101";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  reporter: "list",
  use: {
    baseURL,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env.PORTFOLIO_BROWSER_PATH
      ? { executablePath: process.env.PORTFOLIO_BROWSER_PATH }
      : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PORTFOLIO_TEST_URL
    ? undefined
    : {
        command: "npm run start -- --hostname 127.0.0.1 --port 3101",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
