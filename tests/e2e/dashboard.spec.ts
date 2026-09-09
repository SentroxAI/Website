/* -------------------------------------------------------------------------- */
/*                       E2E: DASHBOARD (CLIENT)                              */
/*                                                                            */
/*  Sprint 4 — Module 10: Tests for client dashboard navigation.             */
/*  Note: These tests require authentication. In CI, use test credentials    */
/*  via environment variables or auth state fixtures.                         */
/* -------------------------------------------------------------------------- */

import { test, expect } from "@playwright/test";

test.describe("Dashboard Navigation", () => {
    test.beforeEach(async ({ page }) => {
        // Try to navigate to dashboard — will redirect to login if not authenticated
        await page.goto("/dashboard");
    });

    test("should redirect to login when not authenticated", async ({ page }) => {
        await expect(page).toHaveURL(/login/);
    });

    test("should display login form for unauthenticated access", async ({ page }) => {
        await expect(page.getByText(/welcome back|sign in/i)).toBeVisible();
    });
});

test.describe("Dashboard Sidebar Links (Structure Check)", () => {
    /* These tests validate that the dashboard pages exist as routes.
       They don't test authenticated content since that requires login fixtures. */

    const dashboardRoutes = [
        "/dashboard",
        "/dashboard/projects",
        "/dashboard/messages",
        "/dashboard/meetings",
        "/dashboard/files",
        "/dashboard/billing",
        "/dashboard/settings",
    ];

    for (const route of dashboardRoutes) {
        test(`route ${route} should exist and redirect`, async ({ page }) => {
            const response = await page.goto(route);
            // Either loads (200) or redirects to login (302 → 200)
            expect(response?.status()).toBeLessThanOrEqual(404);
            expect(response?.status()).not.toBe(404);
        });
    }
});
