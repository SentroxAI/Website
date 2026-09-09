/* -------------------------------------------------------------------------- */
/*                       E2E: BILLING & PAYMENTS                              */
/*                                                                            */
/*  Sprint 4 — Module 10: Tests for billing pages and payment flow routes.   */
/*  Validates route protection and API endpoint existence.                   */
/* -------------------------------------------------------------------------- */

import { test, expect } from "@playwright/test";

test.describe("Billing & Payments", () => {
    /* ── Client Billing Route ─────────────────────────────────────────── */

    test("should redirect to login from client billing page", async ({ page }) => {
        await page.goto("/dashboard/billing");
        await expect(page).toHaveURL(/login/);
    });

    /* ── Admin Billing Route ──────────────────────────────────────────── */

    test("should redirect to login from admin billing page", async ({ page }) => {
        await page.goto("/admin/billing");
        await expect(page).toHaveURL(/login/);
    });

    /* ── Admin Invoices Route ─────────────────────────────────────────── */

    test("should redirect to login from admin invoices page", async ({ page }) => {
        await page.goto("/admin/invoices");
        await expect(page).toHaveURL(/login/);
    });

    /* ── Payment API Endpoints ────────────────────────────────────────── */

    test("payment API should reject unauthenticated requests", async ({ request }) => {
        const response = await request.post("/api/payments", {
            data: { amount: 1000, planId: "test" },
        });
        expect(response.status()).toBe(401);
    });

    test("payment verify API should reject unauthenticated requests", async ({ request }) => {
        const response = await request.post("/api/payments/verify", {
            data: { orderId: "test", paymentId: "test", signature: "test" },
        });
        expect(response.status()).toBe(401);
    });

    /* ── Invoice API Endpoints ────────────────────────────────────────── */

    test("invoice API should reject unauthenticated requests", async ({ request }) => {
        const response = await request.get("/api/invoices");
        expect(response.status()).toBe(401);
    });
});
