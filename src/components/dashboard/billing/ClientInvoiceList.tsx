"use client";

/* -------------------------------------------------------------------------- */
/*                     CLIENT INVOICE LIST                                    */
/*                                                                            */
/*  Sprint 4 — Module 1: Downloadable invoice list for client dashboard.     */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    Send,
    Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Status Config ─────────────────────────────────────────────────────────── */

const statusStyles: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    draft: { label: "Draft", color: "text-sx-text-muted bg-white/[0.06]", icon: <FileText className="h-3.5 w-3.5" /> },
    sent: { label: "Sent", color: "text-blue-400 bg-blue-500/10", icon: <Send className="h-3.5 w-3.5" /> },
    paid: { label: "Paid", color: "text-emerald-400 bg-emerald-500/10", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    overdue: { label: "Overdue", color: "text-red-400 bg-red-500/10", icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function ClientInvoiceList() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    /* Placeholder — will be connected to getClientInvoices() */
    const invoices: {
        id: string;
        invoice_number: string;
        total: number;
        status: string;
        issue_date: string;
        due_date: string;
    }[] = [];

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-16"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 mb-4">
                    <Receipt className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-base font-semibold text-white">No Invoices Yet</h3>
                <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                    Your invoices will appear here when they are generated. You can download them as PDF.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-3">
            {invoices.map((invoice, i) => {
                const statusInfo = statusStyles[invoice.status] || statusStyles.draft;

                return (
                    <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.1] transition-colors"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 flex-shrink-0">
                            <FileText className="h-5 w-5 text-cyan-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white">
                                    {invoice.invoice_number}
                                </p>
                                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", statusInfo.color)}>
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </span>
                            </div>
                            <p className="text-xs text-sx-text-muted">
                                Issued {new Date(invoice.issue_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                {" · "}
                                Due {new Date(invoice.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-white">
                                ₹{invoice.total.toLocaleString("en-IN")}
                            </p>
                        </div>

                        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 group-hover:opacity-100 hover:bg-white/5 hover:text-white transition-all">
                            <Download className="h-4 w-4" />
                        </button>
                    </motion.div>
                );
            })}
        </div>
    );
}
