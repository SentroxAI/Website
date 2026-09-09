/* -------------------------------------------------------------------------- */
/*                          AUDIT LOG SERVICE                                 */
/*                                                                            */
/*  Sprint 4 — Module 7: Audit logging for security-sensitive operations.     */
/*  Logs login attempts, data changes, admin actions, and system events.      */
/*  Uses Supabase admin client to bypass RLS (audit logs are write-only       */
/*  from the app's perspective).                                              */
/* -------------------------------------------------------------------------- */

import { createAdminClient } from "@/lib/supabase/server";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type AuditAction =
    /* Auth events */
    | "auth.login_success"
    | "auth.login_failed"
    | "auth.logout"
    | "auth.signup"
    | "auth.password_reset_requested"
    | "auth.password_changed"
    | "auth.account_locked"
    | "auth.account_unlocked"
    /* Data mutations */
    | "data.create"
    | "data.update"
    | "data.delete"
    /* Admin actions */
    | "admin.user_role_change"
    | "admin.user_deactivated"
    | "admin.settings_changed"
    | "admin.plan_created"
    | "admin.plan_updated"
    | "admin.refund_issued"
    /* File operations */
    | "file.upload"
    | "file.delete"
    /* AI operations */
    | "ai.proposal_generated"
    | "ai.audit_generated"
    | "ai.content_generated"
    /* System */
    | "system.error"
    | "system.cron_executed";

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditLogEntry {
    action: AuditAction;
    severity?: AuditSeverity;
    userId?: string | null;
    userEmail?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    resource?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
}

/* ── Audit Logger ──────────────────────────────────────────────────────────── */

/**
 * Write an audit log entry to the `audit_logs` table.
 * Uses the admin client to bypass RLS.
 *
 * Fails silently to prevent audit logging from breaking the main flow.
 */
export async function writeAuditLog(entry: AuditLogEntry): Promise<void> {
    try {
        const supabase = createAdminClient();

        const severity = entry.severity || inferSeverity(entry.action);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from("audit_logs" as any).insert({
            action: entry.action,
            severity,
            user_id: entry.userId || null,
            user_email: entry.userEmail || null,
            ip_address: entry.ipAddress || null,
            user_agent: entry.userAgent || null,
            resource: entry.resource || null,
            resource_id: entry.resourceId || null,
            details: entry.details || null,
        });
    } catch (error) {
        // Fail silently — audit logging should never break the main flow
        console.error("⚠️ Audit log write failed:", error);
    }
}

/**
 * Batch write multiple audit log entries.
 */
export async function writeAuditLogs(entries: AuditLogEntry[]): Promise<void> {
    try {
        const supabase = createAdminClient();

        const rows = entries.map((entry) => ({
            action: entry.action,
            severity: entry.severity || inferSeverity(entry.action),
            user_id: entry.userId || null,
            user_email: entry.userEmail || null,
            ip_address: entry.ipAddress || null,
            user_agent: entry.userAgent || null,
            resource: entry.resource || null,
            resource_id: entry.resourceId || null,
            details: entry.details || null,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await supabase.from("audit_logs" as any).insert(rows);
    } catch (error) {
        console.error("⚠️ Batch audit log write failed:", error);
    }
}

/**
 * Query audit logs with filters. Admin use only.
 */
export async function queryAuditLogs(filters?: {
    userId?: string;
    action?: AuditAction;
    severity?: AuditSeverity;
    resource?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
}) {
    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase.from("audit_logs" as any) as any)
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (filters?.userId) query = query.eq("user_id", filters.userId);
    if (filters?.action) query = query.eq("action", filters.action);
    if (filters?.severity) query = query.eq("severity", filters.severity);
    if (filters?.resource) query = query.eq("resource", filters.resource);
    if (filters?.fromDate) query = query.gte("created_at", filters.fromDate);
    if (filters?.toDate) query = query.lte("created_at", filters.toDate);

    query = query.range(
        filters?.offset || 0,
        (filters?.offset || 0) + (filters?.limit || 50) - 1,
    );

    const { data, error, count } = await query;

    if (error) {
        console.error("❌ Audit log query failed:", error);
        return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

/**
 * Infer severity from action type.
 */
function inferSeverity(action: AuditAction): AuditSeverity {
    if (
        action === "auth.login_failed" ||
        action === "auth.account_locked" ||
        action === "admin.refund_issued"
    ) {
        return "warning";
    }

    if (
        action === "system.error" ||
        action === "admin.user_deactivated" ||
        action === "data.delete"
    ) {
        return "critical";
    }

    return "info";
}

/**
 * Extract request metadata for audit logging.
 */
export function extractRequestMeta(headers: Headers): {
    ipAddress: string;
    userAgent: string;
} {
    return {
        ipAddress:
            headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headers.get("x-real-ip") ||
            headers.get("cf-connecting-ip") ||
            "unknown",
        userAgent: headers.get("user-agent") || "unknown",
    };
}
