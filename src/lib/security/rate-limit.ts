/* -------------------------------------------------------------------------- */
/*                      TOKEN BUCKET RATE LIMITER                              */
/*                                                                            */
/*  Sprint 4 — Module 7: In-memory token bucket rate limiter.                 */
/*  Per-endpoint, per-IP configuration. Supports custom windows and limits.   */
/*  For production at scale, swap to Upstash Redis (drop-in compatible).      */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface RateLimitConfig {
    /** Max requests allowed within the window. */
    maxRequests: number;
    /** Window duration in milliseconds. */
    windowMs: number;
}

interface TokenBucket {
    tokens: number;
    lastRefill: number;
}

/* ── Default Endpoint Configs ──────────────────────────────────────────────── */

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
    /* Auth endpoints — stricter */
    "auth:login": { maxRequests: 5, windowMs: 15 * 60 * 1000 },      // 5 per 15 min
    "auth:signup": { maxRequests: 3, windowMs: 60 * 60 * 1000 },     // 3 per hour
    "auth:forgot": { maxRequests: 3, windowMs: 60 * 60 * 1000 },     // 3 per hour

    /* API endpoints — moderate */
    "api:contact": { maxRequests: 5, windowMs: 60 * 60 * 1000 },     // 5 per hour
    "api:newsletter": { maxRequests: 3, windowMs: 60 * 60 * 1000 },  // 3 per hour
    "api:files": { maxRequests: 30, windowMs: 60 * 1000 },           // 30 per minute
    "api:payments": { maxRequests: 10, windowMs: 60 * 1000 },        // 10 per minute

    /* AI endpoints — conservative */
    "ai:proposal": { maxRequests: 10, windowMs: 60 * 60 * 1000 },   // 10 per hour
    "ai:audit": { maxRequests: 5, windowMs: 60 * 60 * 1000 },       // 5 per hour
    "ai:content": { maxRequests: 20, windowMs: 60 * 60 * 1000 },    // 20 per hour
    "ai:chat": { maxRequests: 50, windowMs: 60 * 60 * 1000 },       // 50 per hour

    /* Generic fallback */
    default: { maxRequests: 60, windowMs: 60 * 1000 },               // 60 per minute
};

/* ── In-Memory Store ───────────────────────────────────────────────────────── */

const buckets = new Map<string, TokenBucket>();

/** Periodic cleanup of expired buckets to prevent memory leaks. */
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;

    lastCleanup = now;
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, bucket] of buckets) {
        if (now - bucket.lastRefill > maxAge) {
            buckets.delete(key);
        }
    }
}

/* ── Rate Limiter ──────────────────────────────────────────────────────────── */

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    limit: number;
}

/**
 * Check if a request is allowed under the rate limit.
 *
 * @param identifier - Unique key (e.g., IP address, user ID)
 * @param endpoint - Endpoint key matching RATE_LIMIT_CONFIGS (e.g., "auth:login")
 * @returns RateLimitResult with remaining tokens and reset time
 */
export function rateLimit(
    identifier: string,
    endpoint: string,
): RateLimitResult {
    cleanup();

    const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;
    const key = `${endpoint}:${identifier}`;
    const now = Date.now();

    let bucket = buckets.get(key);

    if (!bucket) {
        /* First request — full bucket */
        bucket = {
            tokens: config.maxRequests - 1,
            lastRefill: now,
        };
        buckets.set(key, bucket);

        return {
            allowed: true,
            remaining: bucket.tokens,
            resetAt: now + config.windowMs,
            limit: config.maxRequests,
        };
    }

    /* ── Refill tokens based on elapsed time ──────────────────────────── */
    const elapsed = now - bucket.lastRefill;
    const refillRate = config.maxRequests / config.windowMs;
    const tokensToAdd = elapsed * refillRate;

    bucket.tokens = Math.min(config.maxRequests, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    /* ── Check if request is allowed ──────────────────────────────────── */
    if (bucket.tokens < 1) {
        const resetAt = now + (1 - bucket.tokens) / refillRate;
        return {
            allowed: false,
            remaining: 0,
            resetAt,
            limit: config.maxRequests,
        };
    }

    bucket.tokens -= 1;

    return {
        allowed: true,
        remaining: Math.floor(bucket.tokens),
        resetAt: now + config.windowMs,
        limit: config.maxRequests,
    };
}

/**
 * Get rate limit headers for HTTP response.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
    };
}

/**
 * Extract IP address from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIP(headers: Headers): string {
    return (
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip") ||
        headers.get("cf-connecting-ip") ||
        "unknown"
    );
}

/**
 * Reset rate limit for a specific identifier and endpoint.
 * Useful for admin overrides.
 */
export function resetRateLimit(identifier: string, endpoint: string): void {
    buckets.delete(`${endpoint}:${identifier}`);
}
