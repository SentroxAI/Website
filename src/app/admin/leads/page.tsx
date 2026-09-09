"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN LEADS PAGE                                      */
/*                                                                            */
/*  Sprint 3 — Module 3: Full CRM lead management.                           */
/*  Layout: Header → Stats → Pipeline → Filters → Table → Drawer             */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { UserPlus, Download, RefreshCw } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import LeadStats from "@/components/admin/leads/LeadStats";
import LeadPipelineBar from "@/components/admin/leads/LeadPipelineBar";
import LeadFilters from "@/components/admin/leads/LeadFilters";
import LeadsTable from "@/components/admin/leads/LeadsTable";
import LeadDetailDrawer from "@/components/admin/leads/LeadDetailDrawer";
import {
    fetchLeads,
    fetchLeadStats,
    updateLeadStatus,
    deleteLead,
    type Lead,
    type LeadStatus,
    type LeadFilters as LeadFiltersType,
    type LeadStatsData,
} from "@/app/actions/leads";

export default function LeadsPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<LeadStatsData>({
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        lost: 0,
        conversionRate: 0,
    });
    const [filters, setFilters] = useState<LeadFiltersType>({
        status: "all",
        search: "",
        service: "all",
        sort: "newest",
    });
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(
        async (showLoader = false) => {
            if (showLoader) setLoading(true);
            setRefreshing(true);

            const [leadsResult, statsResult] = await Promise.all([
                fetchLeads(filters),
                fetchLeadStats(),
            ]);

            setLeads(leadsResult.data);
            setStats(statsResult.data);
            setLoading(false);
            setRefreshing(false);
        },
        [filters],
    );

    useEffect(() => {
        loadData(true);
    }, [loadData]);

    /* ── Handlers ─────────────────────────────────────────────────────────── */
    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedLead(null), 200);
    };

    const handleStatusChange = async (id: string, status: LeadStatus) => {
        const result = await updateLeadStatus(id, status);
        if (result.success) {
            // Optimistic update
            setLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status } : l)),
            );
            if (selectedLead?.id === id) {
                setSelectedLead((prev) => (prev ? { ...prev, status } : null));
            }
            // Refresh stats
            const statsResult = await fetchLeadStats();
            setStats(statsResult.data);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteLead(id);
        if (result.success) {
            setLeads((prev) => prev.filter((l) => l.id !== id));
            if (selectedLead?.id === id) {
                handleCloseDrawer();
            }
            // Refresh stats
            const statsResult = await fetchLeadStats();
            setStats(statsResult.data);
        }
    };

    const handleFiltersChange = (newFilters: LeadFiltersType) => {
        setFilters(newFilters);
    };

    /* ── CSV Export (basic) ───────────────────────────────────────────────── */
    const handleExport = () => {
        if (leads.length === 0) return;

        const headers = ["Name", "Email", "Phone", "Company", "Service", "Budget", "Status", "Source", "Date"];
        const rows = leads.map((l) => [
            l.name,
            l.email,
            l.phone || "",
            l.company || "",
            l.service,
            l.budget || "",
            l.status,
            l.source,
            new Date(l.created_at).toLocaleDateString("en-IN"),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    /* ── Render ───────────────────────────────────────────────────────────── */
    return (
        <AdminContainer>
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                        <UserPlus className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Leads</h1>
                        <p className="text-sm text-sx-text-muted">
                            Manage and track all inbound leads
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => loadData(false)}
                        disabled={refreshing}
                        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={leads.length === 0}
                        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white disabled:opacity-50"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                    </button>
                </div>
            </motion.div>

            {/* Loading skeleton */}
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {/* Key Metrics */}
                    <AdminSection title="Key Metrics" delay={0.05} className="mb-6">
                        <LeadStats stats={stats} />
                    </AdminSection>

                    {/* Pipeline Distribution */}
                    <AdminSection title="Pipeline Distribution" delay={0.1} className="mb-6">
                        <LeadPipelineBar stats={stats} />
                    </AdminSection>

                    {/* Filters + Table */}
                    <AdminSection title="All Leads" delay={0.15} className="mb-6">
                        <div className="space-y-4">
                            <LeadFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                totalResults={leads.length}
                            />
                            <LeadsTable
                                leads={leads}
                                onSelectLead={handleSelectLead}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        </div>
                    </AdminSection>
                </>
            )}

            {/* Detail drawer */}
            <LeadDetailDrawer
                lead={selectedLead}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />
        </AdminContainer>
    );
}

/* ── Loading Skeleton ────────────────────────────────────────────────────────── */

function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Stat cards skeleton */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>

            {/* Pipeline skeleton */}
            <div className="h-20 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />

            {/* Filter skeleton */}
            <div className="h-24 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />

            {/* Table skeleton */}
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-16 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>
        </div>
    );
}
