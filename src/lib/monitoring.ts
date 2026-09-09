/* -------------------------------------------------------------------------- */
/*                      MONITORING & ERROR TRACKING                           */
/*                                                                            */
/*  Sprint 4 — Module 10: Centralized error tracking, performance monitoring, */
/*  and custom event logging. Sentry-ready with a thin abstraction layer.     */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface ErrorContext {
    /** Where the error occurred (e.g., "api:payments", "auth:login"). */
    source: string;
    /** User ID if authenticated. */
    userId?: string;
    /** Additional key-value metadata. */
    metadata?: Record<string, unknown>;
}

export interface PerformanceMetric {
    /** Metric name (e.g., "api.response_time", "db.query_duration"). */
    name: string;
    /** Duration in milliseconds. */
    durationMs: number;
    /** Additional tags/labels. */
    tags?: Record<string, string>;
}

/* ── Configuration ─────────────────────────────────────────────────────────── */

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || "";

/* ── Error Tracking ────────────────────────────────────────────────────────── */

/**
 * Capture and report an error.
 * In production, sends to Sentry (if configured).
 * In development, logs to console with context.
 */
export function captureError(error: Error | unknown, context?: ErrorContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    if (IS_PRODUCTION && SENTRY_DSN) {
        // Sentry integration — uncomment when @sentry/nextjs is installed:
        // Sentry.captureException(errorObj, {
        //     tags: { source: context?.source },
        //     user: context?.userId ? { id: context.userId } : undefined,
        //     extra: context?.metadata,
        // });
        console.error(`[MONITOR] ${context?.source || "unknown"}:`, errorObj.message);
    } else {
        console.error(
            `[ERROR] ${context?.source || "unknown"}:`,
            errorObj.message,
            context?.metadata || "",
        );
    }
}

/**
 * Capture a message (non-error event) for monitoring.
 */
export function captureMessage(
    message: string,
    level: "info" | "warning" | "error" = "info",
    context?: ErrorContext,
): void {
    if (IS_PRODUCTION && SENTRY_DSN) {
        // Sentry.captureMessage(message, { level, tags: { source: context?.source } });
        console.log(`[MONITOR:${level}] ${context?.source || "app"}: ${message}`);
    } else {
        const logFn = level === "error" ? console.error : level === "warning" ? console.warn : console.log;
        logFn(`[${level.toUpperCase()}] ${context?.source || "app"}: ${message}`);
    }
}

/* ── Performance Monitoring ────────────────────────────────────────────────── */

/**
 * Track a performance metric.
 * Logs API response times, database query durations, etc.
 */
export function trackPerformance(metric: PerformanceMetric): void {
    if (IS_PRODUCTION && SENTRY_DSN) {
        // Sentry.metrics.distribution(metric.name, metric.durationMs, {
        //     tags: metric.tags,
        //     unit: "millisecond",
        // });
    }

    // Always log slow operations (> 2 seconds)
    if (metric.durationMs > 2000) {
        console.warn(
            `[SLOW] ${metric.name}: ${metric.durationMs}ms`,
            metric.tags || "",
        );
    }
}

/**
 * Measure the duration of an async operation.
 * Returns the result and logs the timing.
 *
 * @example
 * ```ts
 * const data = await measureAsync("db.fetch_leads", async () => {
 *     return supabase.from("leads").select("*");
 * });
 * ```
 */
export async function measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>,
): Promise<T> {
    const start = performance.now();

    try {
        const result = await fn();
        const durationMs = Math.round(performance.now() - start);

        trackPerformance({ name, durationMs, tags: { ...tags, status: "success" } });

        return result;
    } catch (error) {
        const durationMs = Math.round(performance.now() - start);

        trackPerformance({ name, durationMs, tags: { ...tags, status: "error" } });
        captureError(error, { source: name });

        throw error;
    }
}

/* ── Health Check ──────────────────────────────────────────────────────────── */

/**
 * Basic health check data for monitoring dashboards.
 */
export function getHealthStatus() {
    return {
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        memoryUsage: {
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
    };
}
