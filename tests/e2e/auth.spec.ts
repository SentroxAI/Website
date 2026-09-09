/* -------------------------------------------------------------------------- */
/*                       E2E: AUTH FLOWS                                      */
/*                                                                            */
/*  Sprint 4 — Module 10: Tests for login, signup, password reset flows.     */
/* -------------------------------------------------------------------------- */

import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
    /* ── Login Page ───────────────────────────────────────────────────── */

    test("should display login page with form fields", async ({ page }) => {
        await page.goto("/login");
        await expect(page).toHaveTitle(/Sign In/);
        await expect(page.getByText("Welcome back")).toBeVisible();
        await expect(page.locator("#login-email")).toBeVisible();
        await expect(page.locator("#login-password")).toBeVisible();
    });

    test("should show validation errors for empty login form", async ({ page }) => {
        await page.goto("/login");

        // Try submitting empty form
        await page.getByRole("button", { name: /sign in/i }).click();

        // Should show validation error
        await expect(page.getByText(/email/i)).toBeVisible();
    });

    test("should navigate to signup page", async ({ page }) => {
        await page.goto("/login");

        await page.getByRole("link", { name: /create one/i }).click();
        await expect(page).toHaveURL(/signup/);
    });

    test("should navigate to forgot password page", async ({ page }) => {
        await page.goto("/login");

        await page.getByRole("link", { name: /forgot password/i }).click();
        await expect(page).toHaveURL(/forgot-password/);
    });

    /* ── Signup Page ──────────────────────────────────────────────────── */

    test("should display signup page with form fields", async ({ page }) => {
        await page.goto("/signup");
        await expect(page).toHaveTitle(/Sign Up|Create Account/);
        await expect(page.locator("[name='full_name'], #signup-name")).toBeVisible();
        await expect(page.locator("[name='email'], #signup-email")).toBeVisible();
    });

    test("should show password strength indicator on signup", async ({ page }) => {
        await page.goto("/signup");

        const passwordInput = page.locator("[name='password'], #signup-password");
        await passwordInput.fill("Test1234!");

        // Password strength indicator should appear
        await expect(page.getByText(/strength|weak|medium|strong/i)).toBeVisible();
    });

    /* ── Forgot Password ──────────────────────────────────────────────── */

    test("should display forgot password page", async ({ page }) => {
        await page.goto("/forgot-password");
        await expect(page).toHaveTitle(/Forgot Password|Reset/);
        await expect(page.locator("[name='email'], #reset-email")).toBeVisible();
    });

    /* ── Protected Routes ─────────────────────────────────────────────── */

    test("should redirect unauthenticated users from dashboard", async ({ page }) => {
        await page.goto("/dashboard");

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });

    test("should redirect unauthenticated users from admin", async ({ page }) => {
        await page.goto("/admin");

        // Should redirect to login
        await expect(page).toHaveURL(/login/);
    });
});
