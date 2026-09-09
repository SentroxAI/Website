"use client";

/* -------------------------------------------------------------------------- */
/*                        PAYMENT HISTORY (ADMIN)                             */
/*                                                                            */
/*  Sprint 4 — Module 1: Filterable payment history table.                   */
/*  Includes UPI payment verification actions for admin.                      */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    ArrowUpDown,
    MoreHorizontal,
    IndianRupee,
    ShieldCheck,
    Ban,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPayments } from "@/app/actions/billing";
import type { Payment } from "@/types/billing";
import { toast } from "sonner";

/* ── Status Badge ──────────────────────────────────────────────────────────── */

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="h-3.5 w-3.5" /> },
    processing: { label: "Processing", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <RefreshCw className="h-3.5 w-3.5 animate-spin" /> },
    failed: { label: "Failed", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle className="h-3.5 w-3.5" /> },
    refunded: { label: "Refunded", color: "bg-violet-500/10 text-violet-400 border-violet-500/20", icon: <RefreshCw className="h-3.5 w-3.5" /> },
    partially_refunded: { label: "Partial Refund", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: <RefreshCw className="h-3.5 w-3.5" /> },
};

function StatusBadge({ status }: { status: string }) {
    const config = statusConfig[status] || statusConfig.pending;
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.color)}>
            {config.icon}
            {config.label}
        </span>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function PaymentHistory() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    const loadPayments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPayments({
                status: statusFilter !== "all" ? statusFilter : undefined,
                limit: 50,
            });
            setPayments(data);
        } catch (error) {
            console.error("Failed to load payments:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        loadPayments();
    }, [loadPayments]);

    const filteredPayments = payments.filter((p) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.razorpay_payment_id?.toLowerCase().includes(q) ||
            p.razorpay_order_id?.toLowerCase().includes(q) ||
            p.client_id.toLowerCase().includes(q)
        );
    });

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    /* ── Admin verify / reject UPI payment ─────────────────────────── */
    const handleAdminVerify = async (paymentId: string, action: "verify" | "reject") => {
        const reason = action === "reject"
            ? window.prompt("Reason for rejection (optional):")
            : undefined;

        // User cancelled the prompt
        if (action === "reject" && reason === null) return;

        setVerifyingId(paymentId);
        try {
            const res = await fetch("/api/payments/admin-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    payment_id: paymentId,
                    action,
                    reason: reason || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || `Failed to ${action} payment`);
            }
            toast.success(action === "verify" ? "Payment verified!" : "Payment rejected");
            loadPayments(); // Refresh list
        } catch (err) {
            toast.error(err instanceof Error ? err.message : `Failed to ${action} payment`);
        } finally {
            setVerifyingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Filters ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        placeholder="Search by payment ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-sx-text-subtle focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-sx-text-subtle" />
                    <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
                        {["all", "completed", "processing", "pending", "failed", "refunded"].map(
                            (status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "rounded-md px-3 py-1.5 text-xs font-medium transition-all capitalize",
                                        statusFilter === status
                                            ? "bg-white/[0.08] text-white"
                                            : "text-sx-text-muted hover:text-sx-text-subtle",
                                    )}
                                >
                                    {status}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </div>

            {/* ── Payment Table ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
                {/* Header */}
                <div className="grid grid-cols-[1fr_1fr_100px_120px_60px] gap-4 border-b border-white/[0.06] px-5 py-3 text-xs font-medium uppercase tracking-wider text-sx-text-muted">
                    <div className="flex items-center gap-1">
                        Payment <ArrowUpDown className="h-3 w-3" />
                    </div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div />
                </div>

                {/* Body */}
                {loading ? (
                    <div className="space-y-0">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="grid grid-cols-[1fr_1fr_100px_120px_60px] gap-4 border-b border-white/[0.04] px-5 py-4">
                                <div className="h-4 w-32 animate-pulse rounded bg-white/[0.04]" />
                                <div className="h-4 w-20 animate-pulse rounded bg-white/[0.04]" />
                                <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.04]" />
                                <div className="h-4 w-24 animate-pulse rounded bg-white/[0.04]" />
                                <div className="h-4 w-4 animate-pulse rounded bg-white/[0.04]" />
                            </div>
                        ))}
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] mb-3">
                            <IndianRupee className="h-5 w-5 text-sx-text-subtle" />
                        </div>
                        <p className="text-sm font-medium text-white">No payments found</p>
                        <p className="mt-1 text-xs text-sx-text-muted">
                            {searchQuery ? "Try adjusting your search" : "Payments will appear here once clients make transactions"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {filteredPayments.map((payment, i) => (
                            <motion.div
                                key={payment.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="grid grid-cols-[1fr_1fr_100px_120px_60px] gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                            >
                                {/* Payment info */}
                                <div>
                                    <p className="text-sm font-medium text-white truncate">
                                        {payment.razorpay_payment_id || payment.razorpay_order_id || "—"}
                                    </p>
                                    <p className="text-xs text-sx-text-muted truncate">
                                        {payment.payment_method}
                                    </p>
                                </div>

                                {/* Amount */}
                                <div className="flex items-center">
                                    <span className="text-sm font-semibold text-white">
                                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                                    </span>
                                    {payment.refund_amount > 0 && (
                                        <span className="ml-2 text-xs text-red-400">
                                            -₹{Number(payment.refund_amount).toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="flex items-center">
                                    <StatusBadge status={payment.status} />
                                </div>

                                {/* Date */}
                                <div className="flex items-center">
                                    <span className="text-xs text-sx-text-muted">
                                        {formatDate(payment.created_at)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-1">
                                    {payment.status === "processing" ? (
                                        verifyingId === payment.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleAdminVerify(payment.id, "verify")}
                                                    title="Verify payment"
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                                >
                                                    <ShieldCheck className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleAdminVerify(payment.id, "reject")}
                                                    title="Reject payment"
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <Ban className="h-4 w-4" />
                                                </button>
                                            </>
                                        )
                                    ) : (
                                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
