-- ============================================================================
-- AUDIT LOGS SCHEMA
-- Sprint 4 — Module 7: Security Hardening
--
-- Tracks login attempts, data changes, admin actions, and system events.
-- Append-only table — no UPDATE or DELETE from application code.
-- ============================================================================

-- ── Audit Logs Table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
    id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at      timestamptz DEFAULT now() NOT NULL,

    -- Action classification
    action          text NOT NULL,
    severity        text NOT NULL DEFAULT 'info'
                    CHECK (severity IN ('info', 'warning', 'critical')),

    -- Actor information
    user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email      text,
    ip_address      text,
    user_agent      text,

    -- Resource affected
    resource        text,          -- e.g., 'leads', 'projects', 'users'
    resource_id     text,          -- e.g., the UUID of the affected record

    -- Additional context (freeform JSON)
    details         jsonb DEFAULT '{}'::jsonb
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
    ON audit_logs (user_id)
    WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs (action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_severity
    ON audit_logs (severity)
    WHERE severity IN ('warning', 'critical');

CREATE INDEX IF NOT EXISTS idx_audit_logs_resource
    ON audit_logs (resource, resource_id)
    WHERE resource IS NOT NULL;

-- Composite index for the most common query: recent logs by user
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_recent
    ON audit_logs (user_id, created_at DESC)
    WHERE user_id IS NOT NULL;

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by the audit service)
CREATE POLICY "service_role_full_access"
    ON audit_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Admins can read audit logs (via RPC or direct select)
CREATE POLICY "admins_can_read_audit_logs"
    ON audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- No one can update or delete audit logs (append-only)
-- The absence of UPDATE/DELETE policies enforces this via RLS.

-- ── Auto-cleanup: Remove logs older than 90 days ─────────────────────────────
-- This can be run via a cron job or Supabase scheduled function.
-- Uncomment if you want automatic purging:
--
-- CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
-- RETURNS void AS $$
-- BEGIN
--     DELETE FROM audit_logs WHERE created_at < now() - INTERVAL '90 days';
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Comments ─────────────────────────────────────────────────────────────────
COMMENT ON TABLE audit_logs IS 'Append-only security audit log for tracking all sensitive operations';
COMMENT ON COLUMN audit_logs.action IS 'Action identifier, e.g., auth.login_success, data.create, admin.refund_issued';
COMMENT ON COLUMN audit_logs.severity IS 'Log severity: info, warning, critical';
COMMENT ON COLUMN audit_logs.details IS 'Additional JSON context for the event';
