"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN PROJECTS PAGE                                   */
/*                                                                            */
/*  Sprint 3 — Module 5: Full project management.                            */
/*  Layout: Header → Stats → Filters → Table → Drawer / Modal               */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Download, RefreshCw, FolderPlus } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import ProjectStats from "@/components/admin/projects/ProjectStats";
import ProjectFilters from "@/components/admin/projects/ProjectFilters";
import ProjectsTable from "@/components/admin/projects/ProjectsTable";
import ProjectDetailDrawer from "@/components/admin/projects/ProjectDetailDrawer";
import AddProjectModal from "@/components/admin/projects/AddProjectModal";
import {
    fetchProjects,
    fetchProjectStats,
    updateProjectStatus,
    updateProjectProgress,
    deleteProject,
    type ProjectWithClient,
    type ProjectStatus,
    type ProjectFilters as ProjectFiltersType,
    type ProjectStatsData,
} from "@/app/actions/projects";

export default function ProjectsPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [projects, setProjects] = useState<ProjectWithClient[]>([]);
    const [stats, setStats] = useState<ProjectStatsData>({
        total: 0,
        active: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        avgProgress: 0,
        totalBudget: 0,
    });
    const [filters, setFilters] = useState<ProjectFiltersType>({
        status: "all",
        search: "",
        service: "all",
        sort: "newest",
    });
    const [selectedProject, setSelectedProject] = useState<ProjectWithClient | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(
        async (showLoader = false) => {
            if (showLoader) setLoading(true);
            setRefreshing(true);

            const [projectsResult, statsResult] = await Promise.all([
                fetchProjects(filters),
                fetchProjectStats(),
            ]);

            setProjects(projectsResult.data);
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
    const handleSelectProject = (project: ProjectWithClient) => {
        setSelectedProject(project);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedProject(null), 200);
    };

    const handleStatusChange = async (id: string, status: ProjectStatus) => {
        const result = await updateProjectStatus(id, status);
        if (result.success) {
            // Optimistic update
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? { ...p, status, progress: status === "completed" ? 100 : p.progress }
                        : p,
                ),
            );
            if (selectedProject?.id === id) {
                setSelectedProject((prev) =>
                    prev
                        ? { ...prev, status, progress: status === "completed" ? 100 : prev.progress }
                        : null,
                );
            }
            // Refresh stats
            const statsResult = await fetchProjectStats();
            setStats(statsResult.data);
        }
    };

    const handleProgressChange = async (id: string, progress: number) => {
        const result = await updateProjectProgress(id, progress);
        if (result.success) {
            // Optimistic update
            setProjects((prev) =>
                prev.map((p) => (p.id === id ? { ...p, progress } : p)),
            );
            if (selectedProject?.id === id) {
                setSelectedProject((prev) => (prev ? { ...prev, progress } : null));
            }
            // Refresh stats (avg progress changes)
            const statsResult = await fetchProjectStats();
            setStats(statsResult.data);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteProject(id);
        if (result.success) {
            setProjects((prev) => prev.filter((p) => p.id !== id));
            if (selectedProject?.id === id) {
                handleCloseDrawer();
            }
            // Refresh stats
            const statsResult = await fetchProjectStats();
            setStats(statsResult.data);
        }
    };

    const handleFiltersChange = (newFilters: ProjectFiltersType) => {
        setFilters(newFilters);
    };

    const handleAddSuccess = () => {
        loadData(false);
    };

    /* ── CSV Export ────────────────────────────────────────────────────────── */
    const handleExport = () => {
        if (projects.length === 0) return;

        const headers = ["Title", "Client", "Company", "Service", "Status", "Progress", "Budget", "Start Date", "Due Date", "Created"];
        const rows = projects.map((p) => [
            p.title,
            p.clients?.users?.full_name || "",
            p.clients?.company || "",
            p.service,
            p.status,
            `${p.progress}%`,
            p.budget ? `₹${p.budget}` : "",
            p.start_date ? new Date(p.start_date).toLocaleDateString("en-IN") : "",
            p.due_date ? new Date(p.due_date).toLocaleDateString("en-IN") : "",
            new Date(p.created_at).toLocaleDateString("en-IN"),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `projects-export-${new Date().toISOString().slice(0, 10)}.csv`;
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                        <FolderKanban className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Projects</h1>
                        <p className="text-sm text-sx-text-muted">
                            Manage and track all projects
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-3 text-xs font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-violet-400 hover:shadow-violet-500/30"
                    >
                        <FolderPlus className="h-3.5 w-3.5" />
                        New Project
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
                        disabled={projects.length === 0}
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
                        <ProjectStats stats={stats} />
                    </AdminSection>

                    {/* Filters + Table */}
                    <AdminSection title="All Projects" delay={0.1} className="mb-6">
                        <div className="space-y-4">
                            <ProjectFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                totalResults={projects.length}
                            />
                            <ProjectsTable
                                projects={projects}
                                onSelectProject={handleSelectProject}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                            />
                        </div>
                    </AdminSection>
                </>
            )}

            {/* Detail drawer */}
            <ProjectDetailDrawer
                project={selectedProject}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                onStatusChange={handleStatusChange}
                onProgressChange={handleProgressChange}
                onDelete={handleDelete}
            />

            {/* Add project modal */}
            <AddProjectModal
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
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[...Array(6)].map((_, i) => (
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
