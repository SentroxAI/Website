"use client";

/* -------------------------------------------------------------------------- */
/*                       INVOICE MANAGER (ADMIN)                              */
/*                                                                            */
/*  Sprint 4 — Module 1: Invoice list, status management, and quick actions. */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Plus,
    FileText,
    Download,
    Send,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInvoices, updateInvoiceStatus } from "@/app/actions/billing";
import type { Invoice } from "@/types/billing";

/* ── Status Config ─────────────────────────────────────────────────────────── */

const invoiceStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    draft: { label: "Draft", color: "bg-white/[0.06] text-sx-text-muted border-white/[0.08]", icon: <FileText className="h-3.5 w-3.5" /> },
    sent: { label: "Sent", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Send className="h-3.5 w-3.5" /> },
    paid: { label: "Paid", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    overdue: { label: "Overdue", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <AlertCircle className="h-3.5 w-3.5" /> },
    cancelled: { label: "Cancelled", color: "bg-white/[0.06] text-sx-text-subtle border-white/[0.08]", icon: <XCircle className="h-3.5 w-3.5" /> },
    refunded: { label: "Refunded", color: "bg-violet-500/10 text-violet-400 border-violet-500/20", icon: <IndianRupee className="h-3.5 w-3.5" /> },
};

function InvoiceStatusBadge({ status }: { status: string }) {
    const config = invoiceStatusConfig[status] || invoiceStatusConfig.draft;
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.color)}>
            {config.icon}
            {config.label}
        </span>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function InvoiceManager() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [actionMenuId, setActionMenuId] = useState<string | null>(null);

    const loadInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInvoices({
                status: statusFilter !== "all" ? statusFilter : undefined,
            });
            setInvoices(data);
        } catch (error) {
            console.error("Failed to load invoices:", error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    const handleStatusUpdate = async (invoiceId: string, newStatus: string) => {
        const result = await updateInvoiceStatus(invoiceId, newStatus);
        if (result.success) {
            loadInvoices();
        }
        setActionMenuId(null);
    };

    const filteredInvoices = invoices.filter((inv) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            inv.invoice_number.toLowerCase().includes(q) ||
            inv.billing_name?.toLowerCase().includes(q) ||
            inv.billing_email?.toLowerCase().includes(q)
        );
    });

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="space-y-6">
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-sx-text-subtle focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Status filter */}
                    <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
                        {["all", "draft", "sent", "paid", "overdue"].map((status) => (
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
                        ))}
                    </div>

                    {/* Create Invoice */}
                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* ── Invoice List ─────────────────────────────────────────── */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                    ))}
                </div>
            ) : filteredInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-16">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 mb-3">
                        <FileText className="h-5 w-5 text-cyan-400" />
                    </div>
                    <p className="text-sm font-medium text-white">No invoices found</p>
                    <p className="mt-1 text-xs text-sx-text-muted">
                        {searchQuery ? "Try adjusting your search" : "Create your first invoice to get started"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredInvoices.map((invoice, i) => (
                        <motion.div
                            key={invoice.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="group relative flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.1] hover:bg-white/[0.03] transition-all"
                        >
                            {/* Invoice icon */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 flex-shrink-0">
                                <FileText className="h-5 w-5 text-cyan-400" />
                            </div>

                            {/* Invoice info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-white">
                                        {invoice.invoice_number}
                                    </p>
                                    <InvoiceStatusBadge status={invoice.status} />
                                </div>
                                <p className="mt-0.5 text-xs text-sx-text-muted truncate">
                                    {invoice.billing_name || (invoice.client as { company?: string } | undefined)?.company || "—"}{" "}
                                    · Issued {formatDate(invoice.issue_date)} · Due {formatDate(invoice.due_date)}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-base font-bold text-white">
                                    ₹{Number(invoice.total).toLocaleString("en-IN")}
                                </p>
                                {invoice.tax_amount > 0 && (
                                    <p className="text-[10px] text-sx-text-muted">
                                        incl. ₹{Number(invoice.tax_amount).toLocaleString("en-IN")} GST
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="relative flex-shrink-0">
                                <button
                                    onClick={() => setActionMenuId(actionMenuId === invoice.id ? null : invoice.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>

                                {/* Dropdown menu */}
                                {actionMenuId === invoice.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-white/[0.08] bg-[#0a0f1e] p-1 shadow-xl"
                                    >
                                        {invoice.status === "draft" && (
                                            <button
                                                onClick={() => handleStatusUpdate(invoice.id, "sent")}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-subtle hover:bg-white/[0.04] hover:text-white transition-colors"
                                            >
                                                <Send className="h-3.5 w-3.5" /> Mark as Sent
                                            </button>
                                        )}
                                        {(invoice.status === "sent" || invoice.status === "overdue") && (
                                            <button
                                                onClick={() => handleStatusUpdate(invoice.id, "paid")}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-subtle hover:bg-white/[0.04] hover:text-white transition-colors"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark as Paid
                                            </button>
                                        )}
                                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-subtle hover:bg-white/[0.04] hover:text-white transition-colors">
                                            <Download className="h-3.5 w-3.5" /> Download PDF
                                        </button>
                                        {invoice.status === "draft" && (
                                            <button
                                                onClick={() => handleStatusUpdate(invoice.id, "cancelled")}
                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <XCircle className="h-3.5 w-3.5" /> Cancel
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
