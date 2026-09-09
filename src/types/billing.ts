/* -------------------------------------------------------------------------- */
/*                         BILLING TYPE DEFINITIONS                           */
/*                                                                            */
/*  Sprint 4 — Module 1: Billing types & interfaces.                         */
/*  Supports both UPI (current) and Razorpay (future) payment methods.       */
/* -------------------------------------------------------------------------- */

/* ── UPI Payment ──────────────────────────────────────────────────────────── */

export interface UpiPaymentConfig {
    upiId: string;
    payeeName: string;
    amount: number;
    currency: string;
    referenceId: string;
    description: string;
}

export type UpiPaymentStatus =
    | "pending"        // Order created, awaiting payment
    | "submitted"      // Customer claims they paid (UTR submitted)
    | "verified"       // Admin verified the payment
    | "rejected"       // Admin rejected (invalid UTR)
    | "failed";        // Error / timeout

export interface UpiConfirmationData {
    orderId: string;
    upiTransactionId: string;
}

/* ── Subscription Plan ─────────────────────────────────────────────────────── */

export interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price_monthly: number;
    price_yearly: number;
    currency: string;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
    sort_order: number;
    razorpay_plan_id_monthly: string | null;
    razorpay_plan_id_yearly: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

/* ── Subscription ──────────────────────────────────────────────────────────── */

export type SubscriptionStatus =
    | "active"
    | "cancelled"
    | "paused"
    | "past_due"
    | "trialing"
    | "expired";

export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
    id: string;
    client_id: string;
    plan_id: string;
    status: SubscriptionStatus;
    billing_cycle: BillingCycle;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    cancelled_at: string | null;
    razorpay_subscription_id: string | null;
    razorpay_customer_id: string | null;
    trial_start: string | null;
    trial_end: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    /* Joined relations */
    plan?: SubscriptionPlan;
}

/* ── Payment ───────────────────────────────────────────────────────────────── */

export type PaymentStatus =
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "refunded"
    | "partially_refunded";

export interface Payment {
    id: string;
    client_id: string;
    subscription_id: string | null;
    invoice_id: string | null;
    amount: number;
    currency: string;
    status: PaymentStatus;
    payment_method: string;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
    refund_amount: number;
    refund_reason: string | null;
    refunded_at: string | null;
    failure_reason: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

/* ── Invoice ───────────────────────────────────────────────────────────────── */

export type InvoiceStatus =
    | "draft"
    | "sent"
    | "paid"
    | "overdue"
    | "cancelled"
    | "refunded";

export interface Invoice {
    id: string;
    invoice_number: string;
    client_id: string;
    subscription_id: string | null;
    payment_id: string | null;
    status: InvoiceStatus;
    issue_date: string;
    due_date: string;
    paid_at: string | null;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    total: number;
    currency: string;
    gst_number: string | null;
    billing_name: string | null;
    billing_address: string | null;
    billing_email: string | null;
    billing_phone: string | null;
    notes: string | null;
    pdf_url: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    /* Joined relations */
    items?: InvoiceItem[];
    client?: {
        id: string;
        company: string;
        users: { full_name: string; email: string } | null;
    };
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
    hsn_code: string | null;
    created_at: string;
}

/* ── Transaction ───────────────────────────────────────────────────────────── */

export type TransactionType =
    | "payment"
    | "refund"
    | "subscription_created"
    | "subscription_cancelled"
    | "subscription_renewed"
    | "invoice_generated"
    | "invoice_paid"
    | "invoice_overdue"
    | "plan_upgrade"
    | "plan_downgrade";

export interface Transaction {
    id: string;
    client_id: string | null;
    payment_id: string | null;
    invoice_id: string | null;
    type: TransactionType;
    amount: number;
    currency: string;
    description: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

/* ── Razorpay Types ────────────────────────────────────────────────────────── */

export interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
}

export interface RazorpayPaymentResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface RazorpayWebhookEvent {
    entity: string;
    account_id: string;
    event: string;
    contains: string[];
    payload: {
        payment?: { entity: RazorpayPaymentEntity };
        subscription?: { entity: RazorpaySubscriptionEntity };
        refund?: { entity: RazorpayRefundEntity };
    };
    created_at: number;
}

export interface RazorpayPaymentEntity {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    invoice_id: string | null;
    method: string;
    description: string;
    email: string;
    contact: string;
    notes: Record<string, string>;
    fee: number;
    tax: number;
    error_code: string | null;
    error_description: string | null;
    created_at: number;
}

export interface RazorpaySubscriptionEntity {
    id: string;
    entity: string;
    plan_id: string;
    status: string;
    current_start: number;
    current_end: number;
    customer_id: string;
    notes: Record<string, string>;
}

export interface RazorpayRefundEntity {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    notes: Record<string, string>;
    status: string;
    created_at: number;
}

/* ── Billing Stats ─────────────────────────────────────────────────────────── */

export interface BillingStats {
    totalRevenue: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
    pendingPayments: number;
    overdueInvoices: number;
    revenueGrowth: number;
}

/* ── Form Types ────────────────────────────────────────────────────────────── */

export interface CreateInvoiceData {
    client_id: string;
    items: {
        description: string;
        quantity: number;
        unit_price: number;
        hsn_code?: string;
    }[];
    tax_rate?: number;
    due_date?: string;
    notes?: string;
    gst_number?: string;
    billing_name?: string;
    billing_address?: string;
    billing_email?: string;
    billing_phone?: string;
}

export interface CreatePlanData {
    name: string;
    slug: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    currency?: string;
    features: string[];
    is_popular?: boolean;
    sort_order?: number;
}

export interface RefundData {
    payment_id: string;
    amount: number;
    reason: string;
}
