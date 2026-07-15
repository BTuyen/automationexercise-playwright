import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./utils/env"; // import này tự động chạy dotenv.config() trong env.ts

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // FIX: dùng process.env.CI trực tiếp

  retries: process.env.CI ? 2 : ENV.RETRIES, // FIX: local đọc từ .env, CI ép retry 2
  workers: process.env.CI ? 1 : ENV.WORKERS, // FIX: tương tự
  timeout: ENV.TIMEOUT, // timeout mỗi test

  reporter: [
    ["html", { open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],

  use: {
    baseURL: ENV.BASE_URL, // FIX: từ .env → page.goto('/') tự ghép URL
    trace: "on-first-retry",
    screenshot: "only-on-failure", // FIX: yêu cầu đề bài
    video: "retain-on-failure", // FIX: chỉ giữ video khi fail (nhẹ disk)
  },

  projects: [
    // API không cần browser - chạy 1 lần, không lặp lại theo từng browser project như UI
    {
      name: "api",
      testMatch: /tests\/api/,
    },
    {
      name: "chromium",
      testMatch: /tests\/ui/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: /tests\/ui/,
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
