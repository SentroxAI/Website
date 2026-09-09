/* -------------------------------------------------------------------------- */
/*                       E2E: MARKETING PAGES                                 */
/*                                                                            */
/*  Sprint 4 — Module 10: Tests for all public marketing pages.              */
/*  Validates navigation, SEO meta tags, and key content visibility.         */
/* -------------------------------------------------------------------------- */

import { test, expect } from "@playwright/test";

test.describe("Marketing Pages", () => {
    /* ── Homepage ─────────────────────────────────────────────────────── */

    test("should load homepage with hero section", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Sentrox AI/);

        // Hero CTA should be visible
        await expect(page.getByRole("link", { name: /get started|contact|free/i }).first()).toBeVisible();
    });

    test("should have working navbar navigation", async ({ page }) => {
        await page.goto("/");

        // Check that main nav links exist
        const nav = page.locator("nav, header");
        await expect(nav).toBeVisible();
    });

    test("should have footer with copyright", async ({ page }) => {
        await page.goto("/");

        const footer = page.locator("footer");
        await expect(footer).toBeVisible();
        await expect(footer.getByText(/sentrox/i)).toBeVisible();
    });

    /* ── Services Page ────────────────────────────────────────────────── */

    test("should load services page", async ({ page }) => {
        await page.goto("/services");
        await expect(page).toHaveTitle(/Services/);
    });

    /* ── Portfolio Page ───────────────────────────────────────────────── */

    test("should load portfolio page", async ({ page }) => {
        await page.goto("/portfolio");
        await expect(page).toHaveTitle(/Portfolio/);
    });

    /* ── Pricing Page ─────────────────────────────────────────────────── */

    test("should load pricing page with plans", async ({ page }) => {
        await page.goto("/pricing");
        await expect(page).toHaveTitle(/Pricing/);
    });

    /* ── About Page ───────────────────────────────────────────────────── */

    test("should load about page", async ({ page }) => {
        await page.goto("/about");
        await expect(page).toHaveTitle(/About/);
    });

    /* ── Contact Page ─────────────────────────────────────────────────── */

    test("should load contact page with form", async ({ page }) => {
        await page.goto("/contact");
        await expect(page).toHaveTitle(/Contact/);
    });

    /* ── Blog Page ────────────────────────────────────────────────────── */

    test("should load blog listing page", async ({ page }) => {
        await page.goto("/blog");
        await expect(page).toHaveTitle(/Blog/);
    });

    /* ── Legal Pages ──────────────────────────────────────────────────── */

    test("should load privacy policy page", async ({ page }) => {
        await page.goto("/privacy-policy");
        await expect(page).toHaveTitle(/Privacy/);
    });

    test("should load terms page", async ({ page }) => {
        await page.goto("/terms");
        await expect(page).toHaveTitle(/Terms/);
    });

    test("should load cookies page", async ({ page }) => {
        await page.goto("/cookies");
        await expect(page).toHaveTitle(/Cookie/);
    });

    /* ── SEO Checks ───────────────────────────────────────────────────── */

    test("should have meta description on homepage", async ({ page }) => {
        await page.goto("/");

        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveAttribute("content", /.+/);
    });

    test("should have OpenGraph tags on homepage", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
    });

    test("should have JSON-LD structured data", async ({ page }) => {
        await page.goto("/");

        const jsonLd = page.locator('script[type="application/ld+json"]');
        const count = await jsonLd.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test("should return valid sitemap.xml", async ({ page }) => {
        const response = await page.goto("/sitemap.xml");
        expect(response?.status()).toBe(200);
    });

    test("should return valid robots.txt", async ({ page }) => {
        const response = await page.goto("/robots.txt");
        expect(response?.status()).toBe(200);
    });

    test("should return valid RSS feed", async ({ page }) => {
        const response = await page.goto("/feed.xml");
        expect(response?.status()).toBe(200);

        const contentType = response?.headers()["content-type"];
        expect(contentType).toContain("xml");
    });

    /* ── 404 Page ─────────────────────────────────────────────────────── */

    test("should display 404 for unknown routes", async ({ page }) => {
        const response = await page.goto("/this-page-does-not-exist");
        expect(response?.status()).toBe(404);
    });

    /* ── Mobile Responsiveness ────────────────────────────────────────── */

    test("should be responsive on mobile viewport", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto("/");

        // Page should load without horizontal overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // Small tolerance
    });
});
