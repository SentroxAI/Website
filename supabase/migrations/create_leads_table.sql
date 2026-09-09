-- ============================================================================
-- LEADS TABLE — Stores contact form & enquiry submissions
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================================

-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    company     TEXT,
    service     TEXT NOT NULL,
    budget      TEXT,
    message     TEXT NOT NULL,
    source      TEXT DEFAULT 'contact_form',
    status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    notes       TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for the API route using admin client)
CREATE POLICY "Service role full access"
    ON public.leads
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated admins can read all leads
CREATE POLICY "Admins can read leads"
    ON public.leads
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Policy: Authenticated admins can update leads (status, notes, assignment)
CREATE POLICY "Admins can update leads"
    ON public.leads
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_leads_updated_at();

-- Grant usage to service_role (needed for admin client inserts)
GRANT ALL ON public.leads TO service_role;
GRANT ALL ON public.leads TO authenticated;
