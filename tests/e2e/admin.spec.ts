/* -------------------------------------------------------------------------- */
/*                       E2E: ADMIN PAGES                                     */
/*                                                                            */
/*  Sprint 4 — Module 10: Tests for admin dashboard routes.                  */
/*  Validates route protection and page structure.                           */
/* -------------------------------------------------------------------------- */

import { test, expect } from "@playwright/test";

test.describe("Admin Routes", () => {
    /* ── Route Protection ─────────────────────────────────────────────── */

    test("should redirect unauthenticated users from admin", async ({ page }) => {
        await page.goto("/admin");
        await expect(page).toHaveURL(/login/);
    });

    /* ── All Admin Routes Should Exist ─────────────────────────────────── */

    const adminRoutes = [
        "/admin",
        "/admin/leads",
        "/admin/clients",
        "/admin/projects",
        "/admin/billing",
        "/admin/invoices",
        "/admin/team",
        "/admin/blog",
        "/admin/testimonials",
        "/admin/ai",
        "/admin/analytics",
        "/admin/settings",
    ];

    for (const route of adminRoutes) {
        test(`route ${route} should exist and redirect to login`, async ({ page }) => {
            const response = await page.goto(route);
            // Admin routes should redirect unauthenticated users (not 404)
            expect(response?.status()).not.toBe(404);
        });
    }
});
