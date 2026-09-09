/* -------------------------------------------------------------------------- */
/*                        CSRF PROTECTION                                     */
/*                                                                            */
/*  Sprint 4 — Module 7: CSRF token generation and validation.               */
/*  Uses HMAC-SHA256 with a server secret + per-session salt.                 */
/*  Double-submit cookie pattern for stateless CSRF protection.              */
/* -------------------------------------------------------------------------- */

import crypto from "crypto";

/* ── Configuration ─────────────────────────────────────────────────────────── */

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "sentrox-csrf-fallback-secret";
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/* ── Token Generation ──────────────────────────────────────────────────────── */

/**
 * Generate a CSRF token tied to a session identifier.
 * Token format: `timestamp.hmac`
 *
 * @param sessionId - Unique session/user identifier (e.g., Supabase auth user ID)
 * @returns CSRF token string
 */
export function generateCSRFToken(sessionId: string): string {
    const timestamp = Date.now().toString(36);
    const payload = `${timestamp}.${sessionId}`;
    const hmac = crypto
        .createHmac("sha256", CSRF_SECRET)
        .update(payload)
        .digest("hex");

    return `${timestamp}.${hmac}`;
}

/* ── Token Validation ──────────────────────────────────────────────────────── */

/**
 * Validate a CSRF token against the session identifier.
 *
 * @param token - The CSRF token to validate
 * @param sessionId - The session/user identifier used when generating
 * @returns true if valid and not expired
 */
export function validateCSRFToken(token: string, sessionId: string): boolean {
    if (!token || !sessionId) return false;

    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [timestamp, providedHmac] = parts;

    /* ── Check expiry ─────────────────────────────────────────────────── */
    const tokenTime = parseInt(timestamp, 36);
    if (isNaN(tokenTime) || Date.now() - tokenTime > TOKEN_EXPIRY_MS) {
        return false;
    }

    /* ── Verify HMAC ──────────────────────────────────────────────────── */
    const payload = `${timestamp}.${sessionId}`;
    const expectedHmac = crypto
        .createHmac("sha256", CSRF_SECRET)
        .update(payload)
        .digest("hex");

    /* ── Timing-safe comparison ───────────────────────────────────────── */
    try {
        return crypto.timingSafeEqual(
            Buffer.from(providedHmac, "hex"),
            Buffer.from(expectedHmac, "hex"),
        );
    } catch {
        return false;
    }
}

/* ── Header Constants ──────────────────────────────────────────────────────── */

/**
 * The header name used for CSRF tokens in requests.
 */
export const CSRF_HEADER = "x-csrf-token";

/**
 * The cookie name for the CSRF token (double-submit pattern).
 */
export const CSRF_COOKIE = "sx-csrf";
