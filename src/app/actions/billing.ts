"use server";

/* -------------------------------------------------------------------------- */
/*                       BILLING SERVER ACTIONS                               */
/*                                                                            */
/*  Sprint 4 — Module 1: Server actions for billing operations.              */
/*  Handles plans, subscriptions, invoices, and payment queries.              */
/* -------------------------------------------------------------------------- */

import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import type {
    SubscriptionPlan,
    Subscription,
    Payment,
    Invoice,
    InvoiceItem,
    Transaction,
    BillingStats,
    CreateInvoiceData,
    CreatePlanData,
} from "@/types/billing";

/* ── Helper: require admin ─────────────────────────────────────────────────── */

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single<{ role: string }>();

    if (profile?.role !== "admin") throw new Error("Forbidden");
    return { supabase, user };
}

async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return { supabase, user };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                        SUBSCRIPTION PLANS                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get all active subscription plans (public).
 */
export async function getPlans(): Promise<SubscriptionPlan[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("❌ Failed to fetch plans:", error);
        return [];
    }
    return (data || []) as unknown as SubscriptionPlan[];
}

/**
 * Get all plans including inactive (admin).
 */
export async function getAllPlans(): Promise<SubscriptionPlan[]> {
    await requireAdmin();
    const admin = createAdminClient();
    const { data, error } = await admin
        .from("subscription_plans")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("❌ Failed to fetch all plans:", error);
        return [];
    }
    return (data || []) as unknown as SubscriptionPlan[];
}

/**
 * Create a subscription plan (admin).
 */
export async function createPlan(
    planData: CreatePlanData,
): Promise<{ success: boolean; error?: string; plan?: SubscriptionPlan }> {
    await requireAdmin();
    const admin = createAdminClient();

    const { data, error } = await admin
        .from("subscription_plans")
        .insert({
            name: planData.name,
            slug: planData.slug,
            description: planData.description || null,
            price_monthly: planData.price_monthly,
            price_yearly: planData.price_yearly,
            currency: planData.currency || "INR",
            features: JSON.stringify(planData.features),
            is_popular: planData.is_popular || false,
            sort_order: planData.sort_order || 0,
        })
        .select()
        .single();

    if (error) {
        console.error("❌ Failed to create plan:", error);
        return { success: false, error: error.message };
    }
    return { success: true, plan: data as unknown as SubscriptionPlan };
}

/**
 * Update a subscription plan (admin).
 */
export async function updatePlan(
    planId: string,
    updates: Partial<CreatePlanData>,
): Promise<{ success: boolean; error?: string }> {
    await requireAdmin();
    const admin = createAdminClient();

    const updateData: Database["public"]["Tables"]["subscription_plans"]["Update"] = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price_monthly !== undefined) updateData.price_monthly = updates.price_monthly;
    if (updates.price_yearly !== undefined) updateData.price_yearly = updates.price_yearly;
    if (updates.features !== undefined) updateData.features = JSON.stringify(updates.features);
    if (updates.is_popular !== undefined) updateData.is_popular = updates.is_popular;
    if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;

    const { error } = await admin
        .from("subscription_plans")
        .update(updateData)
        .eq("id", planId);

    if (error) {
        console.error("❌ Failed to update plan:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Soft-delete a plan by deactivating it (admin).
 */
export async function deactivatePlan(
    planId: string,
): Promise<{ success: boolean; error?: string }> {
    await requireAdmin();
    const admin = createAdminClient();

    const { error } = await admin
        .from("subscription_plans")
        .update({ is_active: false })
        .eq("id", planId);

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                          SUBSCRIPTIONS                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get all subscriptions (admin).
 */
export async function getSubscriptions(): Promise<Subscription[]> {
    await requireAdmin();
    const admin = createAdminClient();

    const { data, error } = await admin
        .from("subscriptions")
        .select("*, plan:subscription_plans(*)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("❌ Failed to fetch subscriptions:", error);
        return [];
    }
    return (data || []) as unknown as Subscription[];
}

/**
 * Get a client's active subscription.
 */
export async function getClientSubscription(
    clientId: string,
): Promise<Subscription | null> {
    const { supabase } = await requireAuth();

    const { data, error } = await supabase
        .from("subscriptions")
        .select("*, plan:subscription_plans(*)")
        .eq("client_id", clientId)
        .in("status", ["active", "trialing"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("❌ Failed to fetch client subscription:", error);
        return null;
    }
    return data as unknown as Subscription | null;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                            PAYMENTS                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get all payments (admin) with optional filters.
 */
export async function getPayments(filters?: {
    status?: string;
    clientId?: string;
    limit?: number;
}): Promise<Payment[]> {
    await requireAdmin();
    const admin = createAdminClient();

    let query = admin
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
    }
    if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
    }
    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error("❌ Failed to fetch payments:", error);
        return [];
    }
    return (data || []) as unknown as Payment[];
}

/**
 * Get a client's payment history.
 */
export async function getClientPayments(
    clientId: string,
): Promise<Payment[]> {
    const { supabase } = await requireAuth();

    const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("❌ Failed to fetch client payments:", error);
        return [];
    }
    return (data || []) as unknown as Payment[];
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                            INVOICES                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get all invoices (admin) with optional filters.
 */
export async function getInvoices(filters?: {
    status?: string;
    clientId?: string;
    limit?: number;
}): Promise<Invoice[]> {
    await requireAdmin();
    const admin = createAdminClient();

    let query = admin
        .from("invoices")
        .select(`
            *,
            items:invoice_items(*),
            client:clients(id, company, users:users(full_name, email))
        `)
        .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
    }
    if (filters?.clientId) {
        query = query.eq("client_id", filters.clientId);
    }
    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error("❌ Failed to fetch invoices:", error);
        return [];
    }
    return (data || []) as unknown as Invoice[];
}

/**
 * Get a client's invoices.
 */
export async function getClientInvoices(
    clientId: string,
): Promise<Invoice[]> {
    const { supabase } = await requireAuth();

    const { data, error } = await supabase
        .from("invoices")
        .select("*, items:invoice_items(*)")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("❌ Failed to fetch client invoices:", error);
        return [];
    }
    return (data || []) as unknown as Invoice[];
}

/**
 * Get a single invoice by ID.
 */
export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
    const { supabase } = await requireAuth();

    const { data, error } = await supabase
        .from("invoices")
        .select(`
            *,
            items:invoice_items(*),
            client:clients(id, company, users:users(full_name, email))
        `)
        .eq("id", invoiceId)
        .single();

    if (error) {
        console.error("❌ Failed to fetch invoice:", error);
        return null;
    }
    return data as unknown as Invoice;
}

/**
 * Create a new invoice with line items (admin).
 */
export async function createInvoice(
    invoiceData: CreateInvoiceData,
): Promise<{ success: boolean; error?: string; invoice?: Invoice }> {
    await requireAdmin();
    const admin = createAdminClient();

    // Calculate totals
    const subtotal = invoiceData.items.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0,
    );
    const taxRate = invoiceData.tax_rate ?? 18;
    const taxAmount = Math.round(subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    // Insert invoice
    const { data: invoice, error: invoiceError } = await admin
        .from("invoices")
        .insert({
            client_id: invoiceData.client_id,
            invoice_number: "", // Auto-generated by trigger
            subtotal,
            tax_rate: taxRate,
            tax_amount: taxAmount,
            total,
            due_date: invoiceData.due_date || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            notes: invoiceData.notes || null,
            gst_number: invoiceData.gst_number || null,
            billing_name: invoiceData.billing_name || null,
            billing_address: invoiceData.billing_address || null,
            billing_email: invoiceData.billing_email || null,
            billing_phone: invoiceData.billing_phone || null,
        })
        .select()
        .single();

    if (invoiceError || !invoice) {
        console.error("❌ Failed to create invoice:", invoiceError);
        return { success: false, error: invoiceError?.message || "Failed to create invoice" };
    }

    // Insert line items
    const items = invoiceData.items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.quantity * item.unit_price,
        hsn_code: item.hsn_code || null,
    }));

    const { error: itemsError } = await admin
        .from("invoice_items")
        .insert(items);

    if (itemsError) {
        console.error("❌ Failed to create invoice items:", itemsError);
        // Delete the invoice if items failed
        await admin.from("invoices").delete().eq("id", invoice.id);
        return { success: false, error: "Failed to create invoice items" };
    }

    // Log transaction
    await admin.from("transactions").insert({
        client_id: invoiceData.client_id,
        invoice_id: invoice.id,
        type: "invoice_generated",
        amount: total,
        description: `Invoice ${invoice.invoice_number} generated`,
    });

    return {
        success: true,
        invoice: invoice as unknown as Invoice,
    };
}

/**
 * Update invoice status (admin).
 */
export async function updateInvoiceStatus(
    invoiceId: string,
    status: string,
): Promise<{ success: boolean; error?: string }> {
    await requireAdmin();
    const admin = createAdminClient();

    const updateData: Database["public"]["Tables"]["invoices"]["Update"] = { status };
    if (status === "paid") {
        updateData.paid_at = new Date().toISOString();
    }

    const { error } = await admin
        .from("invoices")
        .update(updateData)
        .eq("id", invoiceId);

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Delete a draft invoice (admin).
 */
export async function deleteInvoice(
    invoiceId: string,
): Promise<{ success: boolean; error?: string }> {
    await requireAdmin();
    const admin = createAdminClient();

    // Only allow deleting draft invoices
    const { data: invoice } = await admin
        .from("invoices")
        .select("status")
        .eq("id", invoiceId)
        .single<{ status: string }>();

    if (invoice?.status !== "draft") {
        return { success: false, error: "Only draft invoices can be deleted" };
    }

    const { error } = await admin
        .from("invoices")
        .delete()
        .eq("id", invoiceId);

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                          TRANSACTIONS                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get recent transactions (admin).
 */
export async function getTransactions(limit: number = 50): Promise<Transaction[]> {
    await requireAdmin();
    const admin = createAdminClient();

    const { data, error } = await admin
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("❌ Failed to fetch transactions:", error);
        return [];
    }
    return (data || []) as unknown as Transaction[];
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                         BILLING STATS                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get billing statistics for admin dashboard.
 */
export async function getBillingStats(): Promise<BillingStats> {
    await requireAdmin();
    const admin = createAdminClient();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    // Total revenue (all time)
    const { data: totalData } = await admin
        .from("payments")
        .select("amount")
        .eq("status", "completed");

    const totalRevenue = (totalData || []).reduce(
        (sum: number, p: { amount: number }) => sum + Number(p.amount),
        0,
    );

    // Monthly revenue (current month)
    const { data: monthlyData } = await admin
        .from("payments")
        .select("amount")
        .eq("status", "completed")
        .gte("created_at", startOfMonth);

    const monthlyRevenue = (monthlyData || []).reduce(
        (sum: number, p: { amount: number }) => sum + Number(p.amount),
        0,
    );

    // Last month revenue (for growth calculation)
    const { data: lastMonthData } = await admin
        .from("payments")
        .select("amount")
        .eq("status", "completed")
        .gte("created_at", startOfLastMonth)
        .lte("created_at", endOfLastMonth);

    const lastMonthRevenue = (lastMonthData || []).reduce(
        (sum: number, p: { amount: number }) => sum + Number(p.amount),
        0,
    );

    const revenueGrowth = lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    // Active subscriptions count
    const { count: activeSubscriptions } = await admin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .in("status", ["active", "trialing"]);

    // Pending payments count
    const { count: pendingPayments } = await admin
        .from("payments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

    // Overdue invoices count
    const { count: overdueInvoices } = await admin
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .eq("status", "overdue");

    return {
        totalRevenue,
        monthlyRevenue,
        activeSubscriptions: activeSubscriptions || 0,
        pendingPayments: pendingPayments || 0,
        overdueInvoices: overdueInvoices || 0,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    };
}
