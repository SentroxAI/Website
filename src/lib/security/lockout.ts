/* -------------------------------------------------------------------------- */
/*                     LOGIN ATTEMPT TRACKING & LOCKOUT                       */
/*                                                                            */
/*  Sprint 4 — Module 7: Tracks failed login attempts per email/IP.           */
/*  Locks accounts after N consecutive failures. Auto-unlocks after cooldown. */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface LoginAttempt {
    failures: number;
    lastFailure: number;
    lockedUntil: number | null;
}

/* ── Configuration ─────────────────────────────────────────────────────────── */

const MAX_FAILURES = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const FAILURE_WINDOW_MS = 30 * 60 * 1000;   // 30 minutes — failures older than this are reset

/* ── In-Memory Store ───────────────────────────────────────────────────────── */

const attempts = new Map<string, LoginAttempt>();

/** Periodic cleanup of stale entries. */
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, attempt] of attempts) {
        // Remove entries where lockout has expired and failures are old
        const lockExpired = !attempt.lockedUntil || now > attempt.lockedUntil;
        const failuresStale = now - attempt.lastFailure > FAILURE_WINDOW_MS;

        if (lockExpired && failuresStale) {
            attempts.delete(key);
        }
    }
}

/* ── Public API ────────────────────────────────────────────────────────────── */

export interface LockoutStatus {
    locked: boolean;
    remainingAttempts: number;
    lockedUntil: number | null;
    lockoutMinutes: number;
}

/**
 * Check if an account is currently locked.
 *
 * @param identifier - Email address or IP address
 * @returns Lockout status with remaining attempts and unlock time
 */
export function checkLockout(identifier: string): LockoutStatus {
    cleanup();

    const key = identifier.toLowerCase();
    const attempt = attempts.get(key);

    if (!attempt) {
        return {
            locked: false,
            remainingAttempts: MAX_FAILURES,
            lockedUntil: null,
            lockoutMinutes: 0,
        };
    }

    const now = Date.now();

    // Check if lockout has expired
    if (attempt.lockedUntil && now > attempt.lockedUntil) {
        // Unlock — reset the entry
        attempts.delete(key);
        return {
            locked: false,
            remainingAttempts: MAX_FAILURES,
            lockedUntil: null,
            lockoutMinutes: 0,
        };
    }

    // Check if currently locked
    if (attempt.lockedUntil && now <= attempt.lockedUntil) {
        const remainingMs = attempt.lockedUntil - now;
        return {
            locked: true,
            remainingAttempts: 0,
            lockedUntil: attempt.lockedUntil,
            lockoutMinutes: Math.ceil(remainingMs / 60000),
        };
    }

    // Check if failures have expired (outside the window)
    if (now - attempt.lastFailure > FAILURE_WINDOW_MS) {
        attempts.delete(key);
        return {
            locked: false,
            remainingAttempts: MAX_FAILURES,
            lockedUntil: null,
            lockoutMinutes: 0,
        };
    }

    return {
        locked: false,
        remainingAttempts: Math.max(0, MAX_FAILURES - attempt.failures),
        lockedUntil: null,
        lockoutMinutes: 0,
    };
}

/**
 * Record a failed login attempt.
 * Returns the updated lockout status.
 *
 * @param identifier - Email address or IP address
 */
export function recordFailedAttempt(identifier: string): LockoutStatus {
    cleanup();

    const key = identifier.toLowerCase();
    const now = Date.now();
    const attempt = attempts.get(key);

    if (!attempt) {
        // First failure
        attempts.set(key, {
            failures: 1,
            lastFailure: now,
            lockedUntil: null,
        });

        return {
            locked: false,
            remainingAttempts: MAX_FAILURES - 1,
            lockedUntil: null,
            lockoutMinutes: 0,
        };
    }

    // If failures are outside the window, reset
    if (now - attempt.lastFailure > FAILURE_WINDOW_MS) {
        attempt.failures = 1;
        attempt.lastFailure = now;
        attempt.lockedUntil = null;

        return {
            locked: false,
            remainingAttempts: MAX_FAILURES - 1,
            lockedUntil: null,
            lockoutMinutes: 0,
        };
    }

    // Increment failures
    attempt.failures += 1;
    attempt.lastFailure = now;

    // Check if we should lock
    if (attempt.failures >= MAX_FAILURES) {
        attempt.lockedUntil = now + LOCKOUT_DURATION_MS;

        return {
            locked: true,
            remainingAttempts: 0,
            lockedUntil: attempt.lockedUntil,
            lockoutMinutes: Math.ceil(LOCKOUT_DURATION_MS / 60000),
        };
    }

    return {
        locked: false,
        remainingAttempts: MAX_FAILURES - attempt.failures,
        lockedUntil: null,
        lockoutMinutes: 0,
    };
}

/**
 * Clear failed attempts after a successful login.
 *
 * @param identifier - Email address or IP address
 */
export function clearAttempts(identifier: string): void {
    attempts.delete(identifier.toLowerCase());
}

/**
 * Manually unlock an account (admin action).
 *
 * @param identifier - Email address or IP address
 */
export function unlockAccount(identifier: string): void {
    attempts.delete(identifier.toLowerCase());
}
