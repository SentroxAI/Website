/* -------------------------------------------------------------------------- */
/*                      SECURITY MODULE — BARREL EXPORT                       */
/*                                                                            */
/*  Sprint 4 — Module 7: Re-exports all security utilities.                   */
/* -------------------------------------------------------------------------- */

export { rateLimit, rateLimitHeaders, getClientIP, resetRateLimit } from "./rate-limit";
export type { RateLimitConfig, RateLimitResult } from "./rate-limit";

export { generateCSRFToken, validateCSRFToken, CSRF_HEADER, CSRF_COOKIE } from "./csrf";

export { writeAuditLog, writeAuditLogs, queryAuditLogs, extractRequestMeta } from "./audit";
export type { AuditAction, AuditSeverity, AuditLogEntry } from "./audit";

export { checkLockout, recordFailedAttempt, clearAttempts, unlockAccount } from "./lockout";
export type { LockoutStatus } from "./lockout";
