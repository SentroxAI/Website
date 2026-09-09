-- ============================================================================
-- SENTROX AI — DATABASE SCHEMA
-- ============================================================================
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor → New Query)
-- This creates all tables, relationships, triggers, RLS policies, and storage.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. USERS (extends auth.users with profile data)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT NOT NULL,
    full_name   TEXT NOT NULL DEFAULT '',
    avatar_url  TEXT,
    role        TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client', 'team')),
    phone       TEXT,
    company     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'Extended user profiles linked 1:1 with auth.users';

-- ────────────────────────────────────────────────────────────────────────────
-- 2. CLIENTS (business profiles for client users)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clients (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    company     TEXT NOT NULL,
    industry    TEXT,
    website     TEXT,
    status      TEXT NOT NULL DEFAULT 'onboarding' CHECK (status IN ('active', 'inactive', 'onboarding')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.clients IS 'Business profile for users with the client role';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. PROJECTS
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id   UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    service     TEXT NOT NULL,
    budget      NUMERIC(12, 2),
    progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'on_hold', 'completed', 'cancelled')),
    start_date  DATE,
    due_date    DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.projects IS 'Client projects tracked through their lifecycle';

-- ────────────────────────────────────────────────────────────────────────────
-- 4. TASKS
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    completed   BOOLEAN NOT NULL DEFAULT false,
    assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.tasks IS 'Individual tasks within a project';

-- ────────────────────────────────────────────────────────────────────────────
-- 5. MESSAGES
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id  UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    content     TEXT NOT NULL,
    read        BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.messages IS 'Direct messages between users, optionally scoped to a project';

CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_project ON public.messages(project_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 6. MEETINGS
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.meetings (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id        UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    organizer_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title            TEXT NOT NULL,
    description      TEXT,
    scheduled_at     TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    meeting_url      TEXT,
    status           TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.meetings IS 'Scheduled meetings with clients';

-- ────────────────────────────────────────────────────────────────────────────
-- 7. FILES (metadata — actual files in Supabase Storage)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.files (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_name   TEXT NOT NULL,
    file_path   TEXT NOT NULL,
    file_size   BIGINT NOT NULL,
    mime_type   TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.files IS 'File metadata for project attachments stored in Supabase Storage';

-- ────────────────────────────────────────────────────────────────────────────
-- 8. LEADS (Contact Form Submissions)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    company     TEXT,
    service     TEXT NOT NULL,
    budget      TEXT,
    message     TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    source      TEXT NOT NULL DEFAULT 'contact_form',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.leads IS 'Contact form submissions and inbound leads';

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- ────────────────────────────────────────────────────────────────────────────
-- 9. NEWSLETTER SUBSCRIBERS
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active     BOOLEAN NOT NULL DEFAULT true
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter email subscriptions';

-- ────────────────────────────────────────────────────────────────────────────
-- 10. BLOG POSTS
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL UNIQUE,
    content      TEXT NOT NULL DEFAULT '',
    excerpt      TEXT,
    cover_image  TEXT,
    author_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    published    BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    tags         TEXT[] NOT NULL DEFAULT '{}',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.blog_posts IS 'Blog articles with full content stored as markdown';

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, published_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- 11. TESTIMONIALS
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.testimonials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_role TEXT NOT NULL,
    company     TEXT NOT NULL,
    content     TEXT NOT NULL,
    rating      INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url  TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.testimonials IS 'Client testimonials displayed on the public website';


-- ============================================================================
-- TRIGGERS — Auto-update `updated_at` timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with that column
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'users', 'clients', 'projects', 'tasks',
            'meetings', 'leads', 'blog_posts'
        ])
    LOOP
        EXECUTE format(
            'CREATE OR REPLACE TRIGGER set_updated_at
             BEFORE UPDATE ON public.%I
             FOR EACH ROW
             EXECUTE FUNCTION public.handle_updated_at()',
            tbl
        );
    END LOOP;
END;
$$;


-- ============================================================================
-- TRIGGER — Auto-create user profile on sign up
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ── Helper function: check if current user is admin ─────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Helper function: get current user's client_id ───────────────────────────

CREATE OR REPLACE FUNCTION public.get_client_id()
RETURNS UUID AS $$
    SELECT id FROM public.clients
    WHERE user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ── USERS policies ──────────────────────────────────────────────────────────

CREATE POLICY "users_select_own"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "users_update_own"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_admin_select"
    ON public.users FOR SELECT
    USING (public.is_admin());

CREATE POLICY "users_admin_update"
    ON public.users FOR UPDATE
    USING (public.is_admin());

-- ── CLIENTS policies ────────────────────────────────────────────────────────

CREATE POLICY "clients_select_own"
    ON public.clients FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "clients_update_own"
    ON public.clients FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_admin_all"
    ON public.clients FOR ALL
    USING (public.is_admin());

-- ── PROJECTS policies ───────────────────────────────────────────────────────

CREATE POLICY "projects_client_select"
    ON public.projects FOR SELECT
    USING (client_id = public.get_client_id());

CREATE POLICY "projects_admin_all"
    ON public.projects FOR ALL
    USING (public.is_admin());

CREATE POLICY "projects_team_select"
    ON public.projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            WHERE tasks.project_id = projects.id
            AND tasks.assigned_to = auth.uid()
        )
    );

-- ── TASKS policies ──────────────────────────────────────────────────────────

CREATE POLICY "tasks_project_member_select"
    ON public.tasks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = tasks.project_id
            AND (p.client_id = public.get_client_id() OR public.is_admin())
        )
        OR assigned_to = auth.uid()
    );

CREATE POLICY "tasks_update_assigned"
    ON public.tasks FOR UPDATE
    USING (assigned_to = auth.uid() OR public.is_admin());

CREATE POLICY "tasks_admin_all"
    ON public.tasks FOR ALL
    USING (public.is_admin());

-- ── MESSAGES policies ───────────────────────────────────────────────────────

CREATE POLICY "messages_participant_select"
    ON public.messages FOR SELECT
    USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "messages_send_as_self"
    ON public.messages FOR INSERT
    WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages_mark_read"
    ON public.messages FOR UPDATE
    USING (receiver_id = auth.uid());

CREATE POLICY "messages_admin_select"
    ON public.messages FOR SELECT
    USING (public.is_admin());

-- ── MEETINGS policies ───────────────────────────────────────────────────────

CREATE POLICY "meetings_client_select"
    ON public.meetings FOR SELECT
    USING (client_id = public.get_client_id());

CREATE POLICY "meetings_organizer_select"
    ON public.meetings FOR SELECT
    USING (organizer_id = auth.uid());

CREATE POLICY "meetings_admin_all"
    ON public.meetings FOR ALL
    USING (public.is_admin());

-- ── FILES policies ──────────────────────────────────────────────────────────

CREATE POLICY "files_project_member_select"
    ON public.files FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = files.project_id
            AND (p.client_id = public.get_client_id() OR public.is_admin())
        )
        OR uploaded_by = auth.uid()
    );

CREATE POLICY "files_upload_own"
    ON public.files FOR INSERT
    WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "files_admin_all"
    ON public.files FOR ALL
    USING (public.is_admin());

-- ── LEADS policies (admin-only) ─────────────────────────────────────────────

CREATE POLICY "leads_admin_all"
    ON public.leads FOR ALL
    USING (public.is_admin());

-- Allow service role inserts (for public contact form)
-- Service role bypasses RLS, so no explicit policy needed for inserts

-- ── NEWSLETTER SUBSCRIBERS policies (admin-only read) ───────────────────────

CREATE POLICY "newsletter_admin_all"
    ON public.newsletter_subscribers FOR ALL
    USING (public.is_admin());

-- ── BLOG POSTS policies ────────────────────────────────────────────────────

CREATE POLICY "blog_public_read"
    ON public.blog_posts FOR SELECT
    USING (published = true);

CREATE POLICY "blog_admin_all"
    ON public.blog_posts FOR ALL
    USING (public.is_admin());

-- ── TESTIMONIALS policies ───────────────────────────────────────────────────

CREATE POLICY "testimonials_public_read"
    ON public.testimonials FOR SELECT
    USING (is_featured = true);

CREATE POLICY "testimonials_admin_all"
    ON public.testimonials FOR ALL
    USING (public.is_admin());


-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Public buckets (images served via CDN)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('team', 'team', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;

-- Private buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('client-files', 'client-files', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false) ON CONFLICT DO NOTHING;


-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- ── Avatars: users can upload/update their own avatar ───────────────────────

CREATE POLICY "avatars_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "avatars_user_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "avatars_user_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ── Public buckets: anyone can read, admins can write ───────────────────────

CREATE POLICY "public_buckets_read"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('blog', 'portfolio', 'team', 'logos'));

CREATE POLICY "public_buckets_admin_write"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id IN ('blog', 'portfolio', 'team', 'logos')
        AND public.is_admin()
    );

CREATE POLICY "public_buckets_admin_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('blog', 'portfolio', 'team', 'logos')
        AND public.is_admin()
    );

CREATE POLICY "public_buckets_admin_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id IN ('blog', 'portfolio', 'team', 'logos')
        AND public.is_admin()
    );

-- ── Client files: authenticated users access their own project files ────────

CREATE POLICY "client_files_read"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'client-files'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "client_files_upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'client-files'
        AND auth.role() = 'authenticated'
    );

-- ── Private buckets (contracts, invoices): admin only ───────────────────────

CREATE POLICY "private_buckets_admin"
    ON storage.objects FOR ALL
    USING (
        bucket_id IN ('contracts', 'invoices')
        AND public.is_admin()
    );

-- Authenticated users can read their own contracts/invoices (scoped by folder)
CREATE POLICY "private_buckets_user_read"
    ON storage.objects FOR SELECT
    USING (
        bucket_id IN ('contracts', 'invoices')
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
