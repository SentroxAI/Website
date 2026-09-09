-- ============================================================================
-- SENTROX AI — BILLING & PAYMENTS SCHEMA
-- ============================================================================
-- Sprint 4 — Module 1: Payments & Billing (Razorpay)
-- Run this in your Supabase SQL Editor after the main schema.sql
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. SUBSCRIPTION PLANS (admin-managed plan catalog)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT,
    price_monthly   NUMERIC(12, 2) NOT NULL DEFAULT 0,
    price_yearly    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency        TEXT NOT NULL DEFAULT 'INR',
    features        JSONB NOT NULL DEFAULT '[]',
    is_popular      BOOLEAN NOT NULL DEFAULT false,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    razorpay_plan_id_monthly TEXT,
    razorpay_plan_id_yearly  TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.subscription_plans IS 'Available subscription plans managed by admin';

CREATE INDEX IF NOT EXISTS idx_plans_active ON public.subscription_plans(is_active, sort_order);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. SUBSCRIPTIONS (active client subscriptions)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id               UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    plan_id                 UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status                  TEXT NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active', 'cancelled', 'paused', 'past_due', 'trialing', 'expired')),
    billing_cycle           TEXT NOT NULL DEFAULT 'monthly'
                            CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start    TIMESTAMPTZ NOT NULL DEFAULT now(),
    current_period_end      TIMESTAMPTZ NOT NULL,
    cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
    cancelled_at            TIMESTAMPTZ,
    razorpay_subscription_id TEXT,
    razorpay_customer_id    TEXT,
    trial_start             TIMESTAMPTZ,
    trial_end               TIMESTAMPTZ,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.subscriptions IS 'Active subscription records linked to clients and plans';

CREATE INDEX IF NOT EXISTS idx_subscriptions_client ON public.subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON public.subscriptions(plan_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. PAYMENTS (individual payment records)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id               UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    subscription_id         UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    invoice_id              UUID,  -- FK added after invoices table
    amount                  NUMERIC(12, 2) NOT NULL,
    currency                TEXT NOT NULL DEFAULT 'INR',
    status                  TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
    payment_method          TEXT DEFAULT 'razorpay',
    razorpay_order_id       TEXT,
    razorpay_payment_id     TEXT,
    razorpay_signature      TEXT,
    refund_amount           NUMERIC(12, 2) DEFAULT 0,
    refund_reason           TEXT,
    refunded_at             TIMESTAMPTZ,
    failure_reason          TEXT,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.payments IS 'Individual payment records linked to Razorpay';

CREATE INDEX IF NOT EXISTS idx_payments_client ON public.payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay ON public.payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON public.payments(created_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. INVOICES
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.invoices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number      TEXT NOT NULL UNIQUE,
    client_id           UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    subscription_id     UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    payment_id          UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
    issue_date          DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date            DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
    paid_at             TIMESTAMPTZ,
    subtotal            NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_rate            NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    tax_amount          NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total               NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency            TEXT NOT NULL DEFAULT 'INR',
    -- GST fields for Indian billing
    gst_number          TEXT,
    billing_name        TEXT,
    billing_address     TEXT,
    billing_email       TEXT,
    billing_phone       TEXT,
    notes               TEXT,
    pdf_url             TEXT,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.invoices IS 'Generated invoices with GST support';

CREATE INDEX IF NOT EXISTS idx_invoices_client ON public.invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON public.invoices(created_at DESC);

-- Add FK from payments to invoices
ALTER TABLE public.payments
    ADD CONSTRAINT fk_payments_invoice
    FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- 5. INVOICE ITEMS (line items within an invoice)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description     TEXT NOT NULL,
    quantity         INTEGER NOT NULL DEFAULT 1,
    unit_price      NUMERIC(12, 2) NOT NULL,
    amount          NUMERIC(12, 2) NOT NULL,
    hsn_code        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.invoice_items IS 'Individual line items within an invoice';

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 6. TRANSACTIONS (audit log of all financial events)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    payment_id      UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    invoice_id      UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    type            TEXT NOT NULL
                    CHECK (type IN (
                        'payment', 'refund', 'subscription_created',
                        'subscription_cancelled', 'subscription_renewed',
                        'invoice_generated', 'invoice_paid', 'invoice_overdue',
                        'plan_upgrade', 'plan_downgrade'
                    )),
    amount          NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency        TEXT NOT NULL DEFAULT 'INR',
    description     TEXT NOT NULL,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.transactions IS 'Immutable audit log of all financial transactions';

CREATE INDEX IF NOT EXISTS idx_transactions_client ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON public.transactions(created_at DESC);


-- ============================================================================
-- TRIGGERS — Auto-update `updated_at` timestamps for new tables
-- ============================================================================

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'subscription_plans', 'subscriptions', 'payments', 'invoices'
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
-- AUTO-GENERATE INVOICE NUMBERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_str TEXT;
    seq_num  INTEGER;
BEGIN
    year_str := TO_CHAR(now(), 'YYYY');

    SELECT COALESCE(MAX(
        CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
    ), 0) + 1
    INTO seq_num
    FROM public.invoices
    WHERE invoice_number LIKE 'SX-' || year_str || '-%';

    NEW.invoice_number := 'SX-' || year_str || '-' || LPAD(seq_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
    EXECUTE FUNCTION public.generate_invoice_number();


-- ============================================================================
-- AUTO-CALCULATE INVOICE TOTALS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.calculate_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
    computed_subtotal NUMERIC(12, 2);
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO computed_subtotal
    FROM public.invoice_items
    WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);

    UPDATE public.invoices
    SET subtotal = computed_subtotal,
        tax_amount = ROUND(computed_subtotal * tax_rate / 100, 2),
        total = computed_subtotal + ROUND(computed_subtotal * tax_rate / 100, 2)
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER recalculate_invoice
    AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_invoice_totals();


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ── Subscription Plans: public read, admin write ────────────────────────────

CREATE POLICY "plans_public_read"
    ON public.subscription_plans FOR SELECT
    USING (is_active = true);

CREATE POLICY "plans_admin_all"
    ON public.subscription_plans FOR ALL
    USING (public.is_admin());

-- ── Subscriptions: client reads own, admin reads all ────────────────────────

CREATE POLICY "subscriptions_client_select"
    ON public.subscriptions FOR SELECT
    USING (client_id = public.get_client_id());

CREATE POLICY "subscriptions_admin_all"
    ON public.subscriptions FOR ALL
    USING (public.is_admin());

-- ── Payments: client reads own, admin reads all ─────────────────────────────

CREATE POLICY "payments_client_select"
    ON public.payments FOR SELECT
    USING (client_id = public.get_client_id());

CREATE POLICY "payments_admin_all"
    ON public.payments FOR ALL
    USING (public.is_admin());

-- ── Invoices: client reads own, admin reads all ─────────────────────────────

CREATE POLICY "invoices_client_select"
    ON public.invoices FOR SELECT
    USING (client_id = public.get_client_id());

CREATE POLICY "invoices_admin_all"
    ON public.invoices FOR ALL
    USING (public.is_admin());

-- ── Invoice Items: inherit invoice access ───────────────────────────────────

CREATE POLICY "invoice_items_read"
    ON public.invoice_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices i
            WHERE i.id = invoice_items.invoice_id
            AND (i.client_id = public.get_client_id() OR public.is_admin())
        )
    );

CREATE POLICY "invoice_items_admin_all"
    ON public.invoice_items FOR ALL
    USING (public.is_admin());

-- ── Transactions: client reads own, admin reads all ─────────────────────────

CREATE POLICY "transactions_client_select"
    ON public.transactions FOR SELECT
    USING (client_id = public.get_client_id());

CREATE POLICY "transactions_admin_all"
    ON public.transactions FOR ALL
    USING (public.is_admin());


-- ============================================================================
-- SEED DATA — Default subscription plans (matching pricing page)
-- ============================================================================

INSERT INTO public.subscription_plans (name, slug, description, price_monthly, price_yearly, currency, is_popular, sort_order, features)
VALUES
    (
        'Starter',
        'starter',
        'Perfect for startups and local businesses looking for a premium online presence.',
        24999.00,
        249999.00,
        'INR',
        false,
        1,
        '["Premium Landing Page", "Responsive Design", "Basic SEO", "Contact Form", "Google Maps Integration", "SSL Security", "Performance Optimization", "30 Days Support"]'::JSONB
    ),
    (
        'Professional',
        'professional',
        'Best for growing businesses that need AI automation and lead generation.',
        59999.00,
        599999.00,
        'INR',
        true,
        2,
        '["Everything in Starter", "AI Chatbot", "Advanced SEO", "Booking System", "Analytics Dashboard", "Google Business Profile", "Email Automation", "Lead Capture", "Performance Monitoring", "Priority Support"]'::JSONB
    ),
    (
        'Enterprise',
        'enterprise',
        'Tailored enterprise solution with unlimited scalability and dedicated support.',
        0.00,
        0.00,
        'INR',
        false,
        3,
        '["Everything in Professional", "Unlimited Pages", "Custom AI Solutions", "CRM Integration", "API Development", "Cloud Infrastructure", "Advanced Security", "Dedicated Project Manager", "24/7 Premium Support", "Custom Integrations", "Training & Onboarding", "Lifetime Consultation"]'::JSONB
    )
ON CONFLICT DO NOTHING;
