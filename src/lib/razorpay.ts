/* -------------------------------------------------------------------------- */
/*                          RAZORPAY SDK HELPER                               */
/*                                                                            */
/*  ⚠️  DEPRECATED — Not currently in use.                                   */
/*  Kept for future reactivation when Razorpay credentials are configured.    */
/*  Current payment method: Direct UPI (see src/lib/upi.ts)                  */
/*                                                                            */
/*  Sprint 4 — Module 1: Server-side Razorpay integration.                   */
/*  Order creation, payment verification, subscription management.            */
/*  Uses the razorpay Node.js SDK and crypto for signature verification.      */
/* -------------------------------------------------------------------------- */

import crypto from "crypto";
import type {
    RazorpayOrderResponse,
    RazorpayPaymentResponse,
} from "@/types/billing";

/* ── Environment ───────────────────────────────────────────────────────────── */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

const RAZORPAY_API = "https://api.razorpay.com/v1";

/**
 * Get Base64-encoded authorization header value for Razorpay API.
 */
function getAuthHeader(): string {
    return `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`;
}

/**
 * Make authenticated request to Razorpay API.
 */
async function razorpayFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${RAZORPAY_API}${endpoint}`, {
        ...options,
        headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("❌ Razorpay API error:", data);
        throw new Error(data.error?.description || "Razorpay API error");
    }

    return data as T;
}

/* ── Orders ────────────────────────────────────────────────────────────────── */

/**
 * Create a Razorpay order for a one-time payment.
 * Amount should be in the smallest currency unit (paise for INR).
 */
export async function createOrder(params: {
    amount: number;
    currency?: string;
    receipt: string;
    notes?: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
    return razorpayFetch<RazorpayOrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify({
            amount: Math.round(params.amount * 100), // Convert to paise
            currency: params.currency || "INR",
            receipt: params.receipt,
            notes: params.notes || {},
        }),
    });
}

/**
 * Fetch an existing Razorpay order by ID.
 */
export async function getOrder(orderId: string): Promise<RazorpayOrderResponse> {
    return razorpayFetch<RazorpayOrderResponse>(`/orders/${orderId}`);
}

/* ── Payment Verification ──────────────────────────────────────────────────── */

/**
 * Verify Razorpay payment signature.
 * This confirms the payment response came from Razorpay and wasn't tampered with.
 */
export function verifyPaymentSignature(
    response: RazorpayPaymentResponse,
): boolean {
    const body = `${response.razorpay_order_id}|${response.razorpay_payment_id}`;

    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === response.razorpay_signature;
}

/**
 * Verify Razorpay webhook signature.
 */
export function verifyWebhookSignature(
    body: string,
    signature: string,
): boolean {
    if (!RAZORPAY_WEBHOOK_SECRET) {
        console.warn("⚠️ RAZORPAY_WEBHOOK_SECRET not set — skipping verification");
        return true;
    }

    const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === signature;
}

/* ── Subscriptions ─────────────────────────────────────────────────────────── */

interface RazorpaySubscription {
    id: string;
    plan_id: string;
    status: string;
    current_start: number | null;
    current_end: number | null;
    customer_id: string;
    total_count: number;
    paid_count: number;
    short_url: string;
}

/**
 * Create a Razorpay subscription.
 */
export async function createSubscription(params: {
    planId: string;
    totalCount?: number;
    customerNotify?: boolean;
    notes?: Record<string, string>;
}): Promise<RazorpaySubscription> {
    return razorpayFetch<RazorpaySubscription>("/subscriptions", {
        method: "POST",
        body: JSON.stringify({
            plan_id: params.planId,
            total_count: params.totalCount || 12,
            customer_notify: params.customerNotify ?? 1,
            notes: params.notes || {},
        }),
    });
}

/**
 * Cancel a Razorpay subscription.
 */
export async function cancelSubscription(
    subscriptionId: string,
    cancelAtCycleEnd: boolean = true,
): Promise<RazorpaySubscription> {
    return razorpayFetch<RazorpaySubscription>(
        `/subscriptions/${subscriptionId}/cancel`,
        {
            method: "POST",
            body: JSON.stringify({
                cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
            }),
        },
    );
}

/**
 * Fetch a Razorpay subscription.
 */
export async function getSubscription(
    subscriptionId: string,
): Promise<RazorpaySubscription> {
    return razorpayFetch<RazorpaySubscription>(
        `/subscriptions/${subscriptionId}`,
    );
}

/* ── Refunds ───────────────────────────────────────────────────────────────── */

interface RazorpayRefund {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    status: string;
    speed_requested: string;
    created_at: number;
}

/**
 * Create a refund for a payment.
 * Amount is in the smallest currency unit (paise for INR).
 */
export async function createRefund(params: {
    paymentId: string;
    amount?: number;
    reason?: string;
    notes?: Record<string, string>;
}): Promise<RazorpayRefund> {
    return razorpayFetch<RazorpayRefund>(
        `/payments/${params.paymentId}/refund`,
        {
            method: "POST",
            body: JSON.stringify({
                amount: params.amount ? Math.round(params.amount * 100) : undefined,
                notes: {
                    reason: params.reason || "Customer requested refund",
                    ...params.notes,
                },
                speed: "normal",
            }),
        },
    );
}

/* ── Plans ─────────────────────────────────────────────────────────────────── */

interface RazorpayPlan {
    id: string;
    entity: string;
    interval: number;
    period: string;
    item: {
        id: string;
        active: boolean;
        amount: number;
        unit_amount: number;
        currency: string;
        name: string;
        description: string;
    };
}

/**
 * Create a Razorpay subscription plan.
 */
export async function createPlan(params: {
    name: string;
    description: string;
    amount: number;
    currency?: string;
    period?: "monthly" | "yearly";
}): Promise<RazorpayPlan> {
    return razorpayFetch<RazorpayPlan>("/plans", {
        method: "POST",
        body: JSON.stringify({
            period: params.period === "yearly" ? "yearly" : "monthly",
            interval: 1,
            item: {
                name: params.name,
                amount: Math.round(params.amount * 100),
                currency: params.currency || "INR",
                description: params.description,
            },
        }),
    });
}

/* ── Customers ─────────────────────────────────────────────────────────────── */

interface RazorpayCustomer {
    id: string;
    entity: string;
    name: string;
    email: string;
    contact: string;
}

/**
 * Create a Razorpay customer.
 */
export async function createCustomer(params: {
    name: string;
    email: string;
    contact?: string;
    notes?: Record<string, string>;
}): Promise<RazorpayCustomer> {
    return razorpayFetch<RazorpayCustomer>("/customers", {
        method: "POST",
        body: JSON.stringify({
            name: params.name,
            email: params.email,
            contact: params.contact || "",
            notes: params.notes || {},
        }),
    });
}

/* ── Utility ───────────────────────────────────────────────────────────────── */

/**
 * Format amount from paise to rupees display string.
 */
export function formatAmount(
    amountInPaise: number,
    currency: string = "INR",
): string {
    const amount = amountInPaise / 100;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format amount (already in rupees) to display string.
 */
export function formatCurrency(
    amount: number,
    currency: string = "INR",
): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Get Razorpay public key for frontend checkout.
 */
export function getPublicKey(): string {
    return RAZORPAY_KEY_ID;
}
