import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "src/e2e",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "vite dev --port=5173 --strictPort",
    port: 5173,
    reuseExistingServer: true,
  },
});
