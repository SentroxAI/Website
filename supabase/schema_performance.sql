-- ============================================================================
-- DATABASE PERFORMANCE OPTIMIZATION
-- Sprint 4 — Module 8: Performance optimization
--
-- Additional indexes for common query patterns and materialized views
-- for analytics dashboards.
-- ============================================================================

-- ══════════════════════════════════════════════════════════════════════════════
-- MISSING INDEXES FOR COMMON QUERIES
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Leads ────────────────────────────────────────────────────────────────────
-- Common: Filter by status, sort by created_at
CREATE INDEX IF NOT EXISTS idx_leads_status_created
    ON leads (status, created_at DESC);

-- Common: Search by email
CREATE INDEX IF NOT EXISTS idx_leads_email
    ON leads (email);

-- Common: Filter by service type
CREATE INDEX IF NOT EXISTS idx_leads_service
    ON leads (service);

-- ── Clients ──────────────────────────────────────────────────────────────────
-- Common: Filter by status, sort by created_at
CREATE INDEX IF NOT EXISTS idx_clients_status_created
    ON clients (status, created_at DESC);

-- Common: Search by company name
CREATE INDEX IF NOT EXISTS idx_clients_company
    ON clients (company);

-- ── Projects ─────────────────────────────────────────────────────────────────
-- Common: Filter by status, sort by created_at
CREATE INDEX IF NOT EXISTS idx_projects_status_created
    ON projects (status, created_at DESC);

-- Common: Filter by client
CREATE INDEX IF NOT EXISTS idx_projects_client
    ON projects (client_id);

-- Common: Active projects for dashboard
CREATE INDEX IF NOT EXISTS idx_projects_active
    ON projects (status)
    WHERE status IN ('in_progress', 'review');

-- ── Blog Posts ───────────────────────────────────────────────────────────────
-- Common: Published posts sorted by date (marketing site listing)
CREATE INDEX IF NOT EXISTS idx_blog_published_date
    ON blog_posts (published_at DESC)
    WHERE published = true;

-- Common: Slug lookup
CREATE INDEX IF NOT EXISTS idx_blog_slug
    ON blog_posts (slug)
    WHERE published = true;

-- ── Team Members ─────────────────────────────────────────────────────────────
-- Common: Active members sorted by display order
CREATE INDEX IF NOT EXISTS idx_team_active_order
    ON team_members (display_order)
    WHERE active = true;

-- ── Testimonials ─────────────────────────────────────────────────────────────
-- Common: Approved testimonials for marketing site
CREATE INDEX IF NOT EXISTS idx_testimonials_approved
    ON testimonials (created_at DESC)
    WHERE approved = true;

-- ── Messages ─────────────────────────────────────────────────────────────────
-- Common: Messages between users, sorted by time
CREATE INDEX IF NOT EXISTS idx_messages_conversation
    ON messages (sender_id, receiver_id, created_at DESC);

-- Common: Unread messages
CREATE INDEX IF NOT EXISTS idx_messages_unread
    ON messages (receiver_id, created_at DESC)
    WHERE read = false;

-- ── Meetings ─────────────────────────────────────────────────────────────────
-- Common: Upcoming meetings
CREATE INDEX IF NOT EXISTS idx_meetings_upcoming
    ON meetings (scheduled_at)
    WHERE status = 'scheduled';

-- ── Notifications ────────────────────────────────────────────────────────────
-- Common: User's unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON notifications (user_id, created_at DESC)
    WHERE read = false;

-- ── Users ────────────────────────────────────────────────────────────────────
-- Common: Lookup by role
CREATE INDEX IF NOT EXISTS idx_users_role
    ON users (role);

-- ── Subscriptions (Billing) ──────────────────────────────────────────────────
-- Common: Active subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_active
    ON subscriptions (status)
    WHERE status = 'active';

-- Common: Client's subscription
CREATE INDEX IF NOT EXISTS idx_subscriptions_client
    ON subscriptions (client_id, created_at DESC);

-- ── Payments (Billing) ───────────────────────────────────────────────────────
-- Common: Recent payments
CREATE INDEX IF NOT EXISTS idx_payments_created
    ON payments (created_at DESC);

-- Common: Payments by client
CREATE INDEX IF NOT EXISTS idx_payments_client
    ON payments (client_id, created_at DESC);


-- ══════════════════════════════════════════════════════════════════════════════
-- MATERIALIZED VIEWS FOR ANALYTICS DASHBOARDS
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Monthly Revenue Summary ──────────────────────────────────────────────────
-- Used by: Admin billing dashboard revenue chart
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_monthly_revenue AS
SELECT
    date_trunc('month', created_at) AS month,
    COUNT(*) AS payment_count,
    SUM(amount) AS total_revenue,
    AVG(amount) AS avg_payment,
    COUNT(DISTINCT client_id) AS unique_clients
FROM payments
WHERE status = 'captured'
GROUP BY date_trunc('month', created_at)
ORDER BY month DESC;

-- Unique index for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_monthly_revenue_month
    ON mv_monthly_revenue (month);

-- ── Lead Pipeline Summary ────────────────────────────────────────────────────
-- Used by: Admin leads dashboard pipeline distribution
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_lead_pipeline AS
SELECT
    status,
    COUNT(*) AS count,
    date_trunc('month', created_at) AS month
FROM leads
GROUP BY status, date_trunc('month', created_at)
ORDER BY month DESC, status;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_lead_pipeline
    ON mv_lead_pipeline (month, status);

-- ── Project Status Distribution ──────────────────────────────────────────────
-- Used by: Admin analytics project status chart
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_project_status AS
SELECT
    status,
    COUNT(*) AS count,
    date_trunc('month', created_at) AS month
FROM projects
GROUP BY status, date_trunc('month', created_at)
ORDER BY month DESC, status;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_project_status
    ON mv_project_status (month, status);


-- ══════════════════════════════════════════════════════════════════════════════
-- REFRESH FUNCTION (call via cron or after batch operations)
-- ══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_revenue;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_lead_pipeline;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_project_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION refresh_analytics_views() TO service_role;

-- ── Comments ─────────────────────────────────────────────────────────────────
COMMENT ON MATERIALIZED VIEW mv_monthly_revenue IS 'Monthly revenue aggregation for billing dashboard charts. Refresh via refresh_analytics_views().';
COMMENT ON MATERIALIZED VIEW mv_lead_pipeline IS 'Lead status distribution by month for pipeline analytics. Refresh via refresh_analytics_views().';
COMMENT ON MATERIALIZED VIEW mv_project_status IS 'Project status distribution by month for project analytics. Refresh via refresh_analytics_views().';
