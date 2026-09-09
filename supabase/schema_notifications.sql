-- ══════════════════════════════════════════════════════════════════════════════
-- Sprint 4 — Module 3: Notifications table
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Notifications table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'system'
                CHECK (type IN ('message','project_update','meeting','payment','invoice','file','system','lead')),
    title       TEXT NOT NULL,
    body        TEXT NOT NULL DEFAULT '',
    link        TEXT,
    read        BOOLEAN NOT NULL DEFAULT false,
    metadata    JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'Persistent user notifications with real-time delivery';

CREATE INDEX IF NOT EXISTS idx_notifications_user       ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created     ON public.notifications(created_at DESC);

-- ── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "notifications_read_own"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

-- Users can update (mark as read) their own notifications
CREATE POLICY "notifications_update_own"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
    ON public.notifications FOR DELETE
    USING (user_id = auth.uid());

-- Admins can insert notifications for any user
CREATE POLICY "notifications_admin_insert"
    ON public.notifications FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Service role (triggers, server actions) can insert for anyone
-- (This is handled by the service role bypassing RLS)

-- ── Enable Realtime for notifications ───────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ── Enable Realtime for messages (if not already enabled) ───────────────────
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ── Function: Create notification ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_body TEXT DEFAULT '',
    p_link TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, type, title, body, link, metadata)
    VALUES (p_user_id, p_type, p_title, p_body, p_link, p_metadata)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

-- ── Trigger: Notify on new message ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sender_name TEXT;
BEGIN
    SELECT full_name INTO v_sender_name
    FROM public.users
    WHERE id = NEW.sender_id;

    PERFORM public.create_notification(
        NEW.receiver_id,
        'message',
        'New message from ' || COALESCE(v_sender_name, 'Someone'),
        LEFT(NEW.content, 100),
        '/dashboard/messages',
        jsonb_build_object('message_id', NEW.id, 'sender_id', NEW.sender_id)
    );

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_new_message ON public.messages;
CREATE TRIGGER trg_notify_new_message
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_new_message();

-- ── Trigger: Notify on project status change ────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_on_project_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_user_id UUID;
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status OR OLD.progress IS DISTINCT FROM NEW.progress THEN
        SELECT user_id INTO v_client_user_id
        FROM public.clients
        WHERE id = NEW.client_id;

        IF v_client_user_id IS NOT NULL THEN
            PERFORM public.create_notification(
                v_client_user_id,
                'project_update',
                'Project update: ' || NEW.title,
                CASE
                    WHEN OLD.status IS DISTINCT FROM NEW.status
                        THEN 'Status changed to ' || NEW.status
                    ELSE 'Progress updated to ' || NEW.progress || '%'
                END,
                '/dashboard/projects',
                jsonb_build_object('project_id', NEW.id)
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_project_update ON public.projects;
CREATE TRIGGER trg_notify_project_update
    AFTER UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_on_project_update();
