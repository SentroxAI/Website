"use client";

/* -------------------------------------------------------------------------- */
/*                          INVOICES PAGE                                      */
/*                                                                            */
/*  Shows payment history as downloadable invoices.                           */
/*  Fetches from Supabase payments table for current user.                    */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Receipt,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    Filter,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import DashboardContainer from "@/components/dashboard/DashboardContainer";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface PaymentRecord {
    id: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    razorpay_order_id: string | null;
    created_at: string;
}

type StatusFilter = "all" | "completed" | "processing" | "pending" | "failed";

/* ── Status config ─────────────────────────────────────────────────────────── */

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: { label: "Paid", color: "text-emerald-400 bg-emerald-500/10", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    processing: { label: "Processing", color: "text-amber-400 bg-amber-500/10", icon: <Clock className="h-3.5 w-3.5" /> },
    pending: { label: "Pending", color: "text-blue-400 bg-blue-500/10", icon: <Clock className="h-3.5 w-3.5" /> },
    failed: { label: "Failed", color: "text-red-400 bg-red-500/10", icon: <XCircle className="h-3.5 w-3.5" /> },
};

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency === "INR" ? "INR" : "USD",
    }).format(amount / 100);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

/* ── Main Component ────────────────────────────────────────────────────────── */

export default function InvoicesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<StatusFilter>("all");
    const [search, setSearch] = useState("");

    /* ── Fetch payments from Supabase ─────────────────────────────── */
    useEffect(() => {
        async function fetchPayments() {
            if (!user) {
                setLoading(false);
                return;
            }

            const supabase = createClient();

            // Get client_id for the user
            const clientResult = await supabase
                .from("clients")
                .select("id")
                .eq("user_id", user.id)
                .single();
            const clientId = (clientResult.data as { id: string } | null)?.id;

            if (clientId) {
                const { data } = await supabase
                    .from("payments")
                    .select("id, amount, currency, status, payment_method, razorpay_order_id, created_at")
                    .eq("client_id", clientId)
                    .order("created_at", { ascending: false });

                setPayments((data as PaymentRecord[]) || []);
            }
            setLoading(false);
        }

        if (!authLoading) {
            fetchPayments();
        }
    }, [user, authLoading]);

    /* ── Filter + search ──────────────────────────────────────────── */
    const filteredPayments = useMemo(() => {
        let result = payments;

        if (filter !== "all") {
            result = result.filter((p) => p.status === filter);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    (p.razorpay_order_id || "").toLowerCase().includes(q) ||
                    p.status.toLowerCase().includes(q)
            );
        }

        return result;
    }, [payments, filter, search]);

    const isLoading = loading || authLoading;

    return (
        <DashboardContainer>
            {/* ── Header ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-xl font-bold text-white md:text-2xl">
                        Invoices
                    </h1>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        View and download your payment invoices.
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search invoices..."
                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30"
                    />
                </div>
            </motion.div>

            {/* ── Filter tabs ──────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-6 flex flex-wrap gap-1"
            >
                {(["all", "completed", "processing", "pending", "failed"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize",
                            filter === s
                                ? "bg-white/[0.08] text-white border border-white/[0.08]"
                                : "text-sx-text-muted hover:text-sx-text-secondary hover:bg-white/[0.04]"
                        )}
                    >
                        {s === "all" ? "All" : s}
                    </button>
                ))}
            </motion.div>

            {/* ── Loading state ─────────────────────────────────────────── */}
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]"
                        />
                    ))}
                </div>
            ) : filteredPayments.length === 0 ? (
                /* ── Empty state ─────────────────────────────────────── */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-20"
                >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
                        <Receipt className="h-6 w-6 text-amber-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                        No invoices found
                    </h2>
                    <p className="mt-2 max-w-xs text-center text-sm text-sx-text-muted">
                        {filter !== "all"
                            ? `No ${filter} invoices found. Try a different filter.`
                            : "Your payment invoices will appear here once you make a payment."}
                    </p>
                </motion.div>
            ) : (
                /* ── Invoice list ─────────────────────────────────────── */
                <>
                    {/* Desktop table header */}
                    <div className="hidden rounded-t-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 sm:grid sm:grid-cols-[1fr_1fr_100px_100px_80px]  gap-4">
                        <span className="text-xs font-medium uppercase tracking-wider text-sx-text-subtle">Invoice</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-sx-text-subtle">Date</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-sx-text-subtle">Amount</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-sx-text-subtle">Status</span>
                        <span className="text-xs font-medium uppercase tracking-wider text-sx-text-subtle sr-only">Actions</span>
                    </div>

                    <div className="space-y-2 sm:space-y-0 sm:divide-y sm:divide-white/[0.04] sm:rounded-b-xl sm:border sm:border-t-0 sm:border-white/[0.06]">
                        {filteredPayments.map((payment, index) => {
                            const status = statusConfig[payment.status] || statusConfig.pending;
                            const invoiceId = payment.razorpay_order_id || `INV-${payment.id.slice(0, 8).toUpperCase()}`;

                            return (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={cn(
                                        /* Mobile: card layout */
                                        "rounded-xl border border-white/[0.06] bg-white/[0.02] p-4",
                                        "sm:rounded-none sm:border-0 sm:bg-transparent sm:px-4 sm:py-3.5",
                                        /* Desktop: grid row */
                                        "sm:grid sm:grid-cols-[1fr_1fr_100px_100px_80px] sm:items-center sm:gap-4",
                                        "transition-colors sm:hover:bg-white/[0.02]"
                                    )}
                                >
                                    {/* Invoice ID */}
                                    <div>
                                        <span className="text-xs text-sx-text-subtle sm:hidden">Invoice: </span>
                                        <span className="text-sm font-medium text-white font-mono">
                                            {invoiceId}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="mt-1 sm:mt-0">
                                        <span className="text-xs text-sx-text-subtle sm:hidden">Date: </span>
                                        <span className="text-sm text-sx-text-muted">
                                            {formatDate(payment.created_at)}
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <div className="mt-1 sm:mt-0">
                                        <span className="text-xs text-sx-text-subtle sm:hidden">Amount: </span>
                                        <span className="text-sm font-semibold text-white">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="mt-2 sm:mt-0">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                            status.color
                                        )}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Download */}
                                    <div className="mt-3 sm:mt-0 sm:text-right">
                                        <button
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-sx-text-muted transition-colors hover:bg-white/[0.1] hover:text-white"
                                            title="Download invoice"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            <span className="sm:hidden">Download</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}
        </DashboardContainer>
    );
}
