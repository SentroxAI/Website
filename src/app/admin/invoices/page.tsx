"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN INVOICES PAGE                                   */
/*                                                                            */
/*  Sprint 4 — Module 1: Full invoice management UI for admins.              */
/*  List invoices, filter by status, view details, and download PDFs.        */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Receipt,
    Search,
    Filter,
    Download,
    Eye,
    Send,
    Trash2,
    Plus,
    Loader2,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    FileText,
    IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminContainer from "@/components/admin/AdminContainer";
import {
    getInvoices,
    updateInvoiceStatus,
    deleteInvoice,
} from "@/app/actions/billing";
import type { Invoice } from "@/types/billing";

/* ── Status config ─────────────────────────────────────────────────────────── */

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    draft: { label: "Draft", icon: <FileText className="h-3.5 w-3.5" />, color: "text-gray-400", bg: "bg-gray-500/10" },
    sent: { label: "Sent", icon: <Send className="h-3.5 w-3.5" />, color: "text-blue-400", bg: "bg-blue-500/10" },
    paid: { label: "Paid", icon: <CheckCircle className="h-3.5 w-3.5" />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    overdue: { label: "Overdue", icon: <AlertCircle className="h-3.5 w-3.5" />, color: "text-red-400", bg: "bg-red-500/10" },
    cancelled: { label: "Cancelled", icon: <XCircle className="h-3.5 w-3.5" />, color: "text-gray-400", bg: "bg-gray-500/10" },
    refunded: { label: "Refunded", icon: <Clock className="h-3.5 w-3.5" />, color: "text-amber-400", bg: "bg-amber-500/10" },
};

const statusFilters = ["all", "draft", "sent", "paid", "overdue", "cancelled", "refunded"];

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

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

    /* ── Actions ───────────────────────────────────────────────────────── */

    const handleStatusUpdate = async (invoiceId: string, status: string) => {
        setActionLoading(invoiceId);
        try {
            await updateInvoiceStatus(invoiceId, status);
            await loadInvoices();
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (invoiceId: string) => {
        if (!confirm("Delete this draft invoice?")) return;
        setActionLoading(invoiceId);
        try {
            await deleteInvoice(invoiceId);
            await loadInvoices();
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDownloadPdf = (invoiceId: string) => {
        window.open(`/api/invoices/${invoiceId}/pdf`, "_blank");
    };

    /* ── Filtered invoices ──────────────────────────────────────────────── */

    const filtered = invoices.filter((inv) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            inv.invoice_number?.toLowerCase().includes(q) ||
            inv.billing_name?.toLowerCase().includes(q) ||
            inv.billing_email?.toLowerCase().includes(q) ||
            (inv.client as { company?: string })?.company?.toLowerCase().includes(q)
        );
    });

    /* ── Stats ──────────────────────────────────────────────────────────── */

    const totalAmount = invoices.reduce((s, i) => s + Number(i.total), 0);
    const paidAmount = invoices.filter(i => i.status === "paid").reduce((s, i) => s + Number(i.total), 0);
    const overdueCount = invoices.filter(i => i.status === "overdue").length;

    return (
        <AdminContainer>
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Invoices</h1>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        Manage and track all client invoices.
                    </p>
                </div>
                <button
                    onClick={() => window.location.href = "/admin/billing"}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Create Invoice
                </button>
            </div>

            {/* ── Stats Bar ─────────────────────────────────────────────── */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                {[
                    { label: "Total Invoiced", value: `₹${totalAmount.toLocaleString("en-IN")}`, icon: <IndianRupee className="h-4 w-4 text-blue-400" />, bg: "bg-blue-500/10" },
                    { label: "Collected", value: `₹${paidAmount.toLocaleString("en-IN")}`, icon: <CheckCircle className="h-4 w-4 text-emerald-400" />, bg: "bg-emerald-500/10" },
                    { label: "Overdue", value: String(overdueCount), icon: <AlertCircle className="h-4 w-4 text-red-400" />, bg: "bg-red-500/10" },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", stat.bg)}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-sx-text-muted">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Filters ──────────────────────────────────────────────── */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-white placeholder:text-sx-text-subtle focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                    />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                    <Filter className="mx-2 h-3.5 w-3.5 text-sx-text-subtle" />
                    {statusFilters.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize",
                                statusFilter === s
                                    ? "bg-white/[0.08] text-white"
                                    : "text-sx-text-subtle hover:text-white hover:bg-white/[0.04]",
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Invoice Table ──────────────────────────────────────────── */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-6 w-6 animate-spin text-sx-text-subtle" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-24">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 mb-4">
                        <Receipt className="h-6 w-6 text-cyan-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">No Invoices Found</p>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        {search ? "Try adjusting your search." : "Create your first invoice to get started."}
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider">Invoice</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider">Client</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold text-sx-text-muted uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider">Due Date</th>
                                <th className="px-5 py-3.5 text-right text-xs font-semibold text-sx-text-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.map((invoice, i) => {
                                    const status = statusConfig[invoice.status] || statusConfig.draft;
                                    const client = invoice.client as { company?: string; users?: { full_name: string } | null } | null;
                                    const isOverdue = invoice.status === "sent" && new Date(invoice.due_date) < new Date();

                                    return (
                                        <motion.tr
                                            key={invoice.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-white">{invoice.invoice_number}</p>
                                                <p className="text-xs text-sx-text-subtle">
                                                    {new Date(invoice.issue_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-white">{client?.company || invoice.billing_name || "—"}</p>
                                                <p className="text-xs text-sx-text-subtle">{client?.users?.full_name || invoice.billing_email || ""}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", status.bg, status.color)}>
                                                    {status.icon}
                                                    {isOverdue ? "Overdue" : status.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <p className="text-sm font-semibold text-white">
                                                    ₹{Number(invoice.total).toLocaleString("en-IN")}
                                                </p>
                                                <p className="text-xs text-sx-text-subtle">
                                                    Tax: ₹{Number(invoice.tax_amount).toLocaleString("en-IN")}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className={cn("text-sm", isOverdue ? "text-red-400 font-medium" : "text-sx-text-subtle")}>
                                                    {new Date(invoice.due_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    {actionLoading === invoice.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-sx-text-subtle" />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleDownloadPdf(invoice.id)}
                                                                title="View / Download PDF"
                                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownloadPdf(invoice.id)}
                                                                title="Download"
                                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                            </button>
                                                            {invoice.status === "draft" && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(invoice.id, "sent")}
                                                                        title="Mark as Sent"
                                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                                    >
                                                                        <Send className="h-3.5 w-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(invoice.id)}
                                                                        title="Delete"
                                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {(invoice.status === "sent" || invoice.status === "overdue") && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(invoice.id, "paid")}
                                                                    title="Mark as Paid"
                                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                                                >
                                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </AdminContainer>
    );
}
