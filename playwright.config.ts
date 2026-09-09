/* -------------------------------------------------------------------------- */
/*                      PLAYWRIGHT CONFIGURATION                              */
/*                                                                            */
/*  Sprint 4 — Module 10: E2E test configuration for the Sentrox AI website. */
/*  Tests run against the local dev server (localhost:3000).                  */
/* -------------------------------------------------------------------------- */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ["html", { open: "never" }],
        ["list"],
    ],

    /* ── Global Settings ───────────────────────────────────────────────────── */
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },

    /* ── Browser Projects ──────────────────────────────────────────────────── */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "mobile-chrome",
            use: { ...devices["Pixel 5"] },
        },
    ],

    /* ── Dev Server ────────────────────────────────────────────────────────── */
    webServer: {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
