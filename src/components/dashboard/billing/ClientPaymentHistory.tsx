"use client";

/* -------------------------------------------------------------------------- */
/*                     CLIENT PAYMENT HISTORY                                 */
/*                                                                            */
/*  Sprint 4 — Module 1: Payment history for the client dashboard.           */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    IndianRupee,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Status Badge ──────────────────────────────────────────────────────────── */

const statusStyles: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: { label: "Completed", color: "text-emerald-400 bg-emerald-500/10", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    pending: { label: "Pending", color: "text-amber-400 bg-amber-500/10", icon: <Clock className="h-3.5 w-3.5" /> },
    failed: { label: "Failed", color: "text-red-400 bg-red-500/10", icon: <XCircle className="h-3.5 w-3.5" /> },
    refunded: { label: "Refunded", color: "text-violet-400 bg-violet-500/10", icon: <RefreshCw className="h-3.5 w-3.5" /> },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function ClientPaymentHistory() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    /* Placeholder — will be connected to getClientPayments() */
    const payments: {
        id: string;
        description: string;
        amount: number;
        status: string;
        date: string;
        method: string;
    }[] = [];

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-16"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
                    <CreditCard className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white">No Payments Yet</h3>
                <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                    Your payment history will appear here once you subscribe to a plan or make a purchase.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-3">
            {payments.map((payment, i) => {
                const statusInfo = statusStyles[payment.status] || statusStyles.pending;

                return (
                    <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.1] transition-colors"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 flex-shrink-0">
                            <IndianRupee className="h-5 w-5 text-blue-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {payment.description}
                            </p>
                            <p className="text-xs text-sx-text-muted">
                                {payment.method} · {new Date(payment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-white">
                                ₹{payment.amount.toLocaleString("en-IN")}
                            </p>
                            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", statusInfo.color)}>
                                {statusInfo.icon}
                                {statusInfo.label}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
