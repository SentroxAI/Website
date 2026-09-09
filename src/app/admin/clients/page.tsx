"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN CLIENTS PAGE                                    */
/*                                                                            */
/*  Sprint 3 — Module 4: Full client management.                             */
/*  Layout: Header → Stats → Filters → Table → Drawer / Modal               */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Download, RefreshCw, UserPlus } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import ClientStats from "@/components/admin/clients/ClientStats";
import ClientFilters from "@/components/admin/clients/ClientFilters";
import ClientsTable from "@/components/admin/clients/ClientsTable";
import ClientDetailDrawer from "@/components/admin/clients/ClientDetailDrawer";
import AddClientModal from "@/components/admin/clients/AddClientModal";
import {
    fetchClients,
    fetchClientStats,
    updateClientStatus,
    deleteClient,
    type ClientWithUser,
    type ClientStatus,
    type ClientFilters as ClientFiltersType,
    type ClientStatsData,
} from "@/app/actions/clients";

export default function ClientsPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [clients, setClients] = useState<ClientWithUser[]>([]);
    const [stats, setStats] = useState<ClientStatsData>({
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
    });
    const [filters, setFilters] = useState<ClientFiltersType>({
        status: "all",
        search: "",
        industry: "all",
        sort: "newest",
    });
    const [selectedClient, setSelectedClient] = useState<ClientWithUser | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(
        async (showLoader = false) => {
            if (showLoader) setLoading(true);
            setRefreshing(true);

            const [clientsResult, statsResult] = await Promise.all([
                fetchClients(filters),
                fetchClientStats(),
            ]);

            setClients(clientsResult.data);
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
    const handleSelectClient = (client: ClientWithUser) => {
        setSelectedClient(client);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedClient(null), 200);
    };

    const handleStatusChange = async (id: string, status: ClientStatus) => {
        const result = await updateClientStatus(id, status);
        if (result.success) {
            // Optimistic update
            setClients((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status } : c)),
            );
            if (selectedClient?.id === id) {
                setSelectedClient((prev) => (prev ? { ...prev, status } : null));
            }
            // Refresh stats
            const statsResult = await fetchClientStats();
            setStats(statsResult.data);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteClient(id);
        if (result.success) {
            setClients((prev) => prev.filter((c) => c.id !== id));
            if (selectedClient?.id === id) {
                handleCloseDrawer();
            }
            // Refresh stats
            const statsResult = await fetchClientStats();
            setStats(statsResult.data);
        }
    };

    const handleFiltersChange = (newFilters: ClientFiltersType) => {
        setFilters(newFilters);
    };

    const handleAddSuccess = () => {
        loadData(false);
    };

    /* ── CSV Export ────────────────────────────────────────────────────────── */
    const handleExport = () => {
        if (clients.length === 0) return;

        const headers = ["Name", "Email", "Phone", "Company", "Industry", "Status", "Website", "Since"];
        const rows = clients.map((c) => [
            c.users?.full_name || "",
            c.users?.email || "",
            c.users?.phone || "",
            c.company,
            c.industry || "",
            c.status,
            c.website || "",
            new Date(c.created_at).toLocaleDateString("en-IN"),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `clients-export-${new Date().toISOString().slice(0, 10)}.csv`;
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                        <Users className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Clients</h1>
                        <p className="text-sm text-sx-text-muted">
                            Manage and track all clients
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 text-xs font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-emerald-400 hover:shadow-emerald-500/30"
                    >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add Client
                    </button>
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
                        disabled={clients.length === 0}
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
                        <ClientStats stats={stats} />
                    </AdminSection>

                    {/* Filters + Table */}
                    <AdminSection title="All Clients" delay={0.1} className="mb-6">
                        <div className="space-y-4">
                            <ClientFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                totalResults={clients.length}
                            />
                            <ClientsTable
                                clients={clients}
                                onSelectClient={handleSelectClient}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        </div>
                    </AdminSection>
                </>
            )}

            {/* Detail drawer */}
            <ClientDetailDrawer
                client={selectedClient}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />

            {/* Add client modal */}
            <AddClientModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSuccess={handleAddSuccess}
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
