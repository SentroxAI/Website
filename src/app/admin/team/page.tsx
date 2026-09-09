"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN TEAM PAGE                                       */
/*                                                                            */
/*  Sprint 3 — Module 6: Full team management.                               */
/*  Layout: Header → Stats → Filters → Table → Drawer / Modal               */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { UsersRound, RefreshCw, UserPlus } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import TeamStats from "@/components/admin/team/TeamStats";
import TeamFilters from "@/components/admin/team/TeamFilters";
import TeamTable from "@/components/admin/team/TeamTable";
import TeamDetailDrawer from "@/components/admin/team/TeamDetailDrawer";
import AddTeamMemberModal from "@/components/admin/team/AddTeamMemberModal";
import {
    fetchTeamMembers,
    fetchTeamStats,
    updateTeamMemberRole,
    removeTeamMember,
    type TeamMember,
    type TeamRole,
    type TeamFilters as TeamFiltersType,
    type TeamStatsData,
} from "@/app/actions/team";

export default function TeamPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [stats, setStats] = useState<TeamStatsData>({
        total: 0,
        admins: 0,
        teamMembers: 0,
    });
    const [filters, setFilters] = useState<TeamFiltersType>({
        role: "all",
        search: "",
        sort: "newest",
    });
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(
        async (showLoader = false) => {
            if (showLoader) setLoading(true);
            setRefreshing(true);

            const [membersResult, statsResult] = await Promise.all([
                fetchTeamMembers(filters),
                fetchTeamStats(),
            ]);

            setMembers(membersResult.data);
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
    const handleSelectMember = (member: TeamMember) => {
        setSelectedMember(member);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedMember(null), 200);
    };

    const handleRoleChange = async (id: string, role: TeamRole) => {
        const result = await updateTeamMemberRole(id, role);
        if (result.success) {
            // Optimistic update
            setMembers((prev) =>
                prev.map((m) => (m.id === id ? { ...m, role } : m)),
            );
            if (selectedMember?.id === id) {
                setSelectedMember((prev) => (prev ? { ...prev, role } : null));
            }
            // Refresh stats
            const statsResult = await fetchTeamStats();
            setStats(statsResult.data);
        }
    };

    const handleRemove = async (id: string) => {
        const result = await removeTeamMember(id);
        if (result.success) {
            setMembers((prev) => prev.filter((m) => m.id !== id));
            if (selectedMember?.id === id) {
                handleCloseDrawer();
            }
            // Refresh stats
            const statsResult = await fetchTeamStats();
            setStats(statsResult.data);
        }
    };

    const handleFiltersChange = (newFilters: TeamFiltersType) => {
        setFilters(newFilters);
    };

    const handleAddSuccess = () => {
        loadData(false);
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                        <UsersRound className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Team</h1>
                        <p className="text-sm text-sx-text-muted">
                            Manage your agency team members
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-3 text-xs font-medium text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-500 hover:to-pink-400 hover:shadow-pink-500/30"
                    >
                        <UserPlus className="h-3.5 w-3.5" />
                        Add Member
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
                </div>
            </motion.div>

            {/* Loading skeleton */}
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {/* Key Metrics */}
                    <AdminSection title="Team Overview" delay={0.05} className="mb-6">
                        <TeamStats stats={stats} />
                    </AdminSection>

                    {/* Filters + Table */}
                    <AdminSection title="All Members" delay={0.1} className="mb-6">
                        <div className="space-y-4">
                            <TeamFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                totalResults={members.length}
                            />
                            <TeamTable
                                members={members}
                                onSelectMember={handleSelectMember}
                                onRoleChange={handleRoleChange}
                                onRemove={handleRemove}
                            />
                        </div>
                    </AdminSection>
                </>
            )}

            {/* Detail drawer */}
            <TeamDetailDrawer
                member={selectedMember}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                onRoleChange={handleRoleChange}
                onRemove={handleRemove}
            />

            {/* Add member modal */}
            <AddTeamMemberModal
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
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
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
