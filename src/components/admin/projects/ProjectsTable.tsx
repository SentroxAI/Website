"use client";

/* -------------------------------------------------------------------------- */
/*                          PROJECTS TABLE                                    */
/*                                                                            */
/*  Main data table for the projects page with staggered row animations,     */
/*  progress bars, responsive column hiding, and row-click to open drawer.   */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Eye,
    ArrowRightLeft,
    Trash2,
    FolderKanban,
    Building2,
    Calendar,
    Briefcase,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ProjectWithClient, ProjectStatus } from "@/app/actions/projects";
import ProjectStatusBadge from "./ProjectStatusBadge";

interface ProjectsTableProps {
    projects: ProjectWithClient[];
    onSelectProject: (project: ProjectWithClient) => void;
    onStatusChange: (id: string, status: ProjectStatus) => void;
    onDelete: (id: string) => void;
}

const statusFlow: ProjectStatus[] = ["pending", "active", "completed", "cancelled"];

function formatBudget(n: number | null): string {
    if (!n) return "—";
    if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
    return `₹${n}`;
}

export default function ProjectsTable({
    projects,
    onSelectProject,
    onStatusChange,
    onDelete,
}: ProjectsTableProps) {
    if (projects.length === 0) {
        return <EmptyState />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Project
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Client
                            </th>
                            <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Service
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Progress
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Status
                            </th>
                            <th className="hidden xl:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Budget
                            </th>
                            <th className="hidden xl:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Due Date
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <ProjectRow
                                key={project.id}
                                project={project}
                                index={index}
                                onSelect={() => onSelectProject(project)}
                                onStatusChange={onStatusChange}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/[0.06]">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onSelect={() => onSelectProject(project)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* ── Table Row (Desktop) ────────────────────────────────────────────────────── */

function ProjectRow({
    project,
    index,
    onSelect,
    onStatusChange,
    onDelete,
}: {
    project: ProjectWithClient;
    index: number;
    onSelect: () => void;
    onStatusChange: (id: string, status: ProjectStatus) => void;
    onDelete: (id: string) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
                setStatusMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const clientName = project.clients?.users?.full_name || "Unknown";
    const companyName = project.clients?.company || "—";

    const dueDate = project.due_date
        ? new Date(project.due_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

    const isOverdue =
        project.due_date &&
        new Date(project.due_date) < new Date() &&
        project.status !== "completed" &&
        project.status !== "cancelled";

    // Progress bar color
    const progressColor =
        project.progress >= 100
            ? "bg-emerald-400"
            : project.progress >= 60
              ? "bg-violet-400"
              : project.progress >= 30
                ? "bg-amber-400"
                : "bg-blue-400";

    return (
        <motion.tr
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            onClick={onSelect}
            className="group cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] last:border-b-0"
        >
            {/* Project */}
            <td className="px-4 py-3.5">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white max-w-[200px]">
                        {project.title}
                    </p>
                    {project.description && (
                        <p className="truncate text-xs text-sx-text-subtle max-w-[200px]">
                            {project.description}
                        </p>
                    )}
                </div>
            </td>

            {/* Client */}
            <td className="px-4 py-3.5">
                <div className="min-w-0">
                    <p className="truncate text-sm text-sx-text-muted">{companyName}</p>
                    <p className="truncate text-xs text-sx-text-subtle">{clientName}</p>
                </div>
            </td>

            {/* Service */}
            <td className="hidden lg:table-cell px-4 py-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2 py-1 text-xs text-sx-text-muted">
                    <Briefcase className="h-3 w-3 text-sx-text-subtle" />
                    {project.service}
                </span>
            </td>

            {/* Progress */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                            className={cn("h-full rounded-full transition-all", progressColor)}
                            style={{ width: `${Math.min(100, project.progress)}%` }}
                        />
                    </div>
                    <span className="text-xs text-sx-text-muted tabular-nums">
                        {project.progress}%
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <ProjectStatusBadge status={project.status as ProjectStatus} />
            </td>

            {/* Budget */}
            <td className="hidden xl:table-cell px-4 py-3.5">
                <span className="text-sm text-sx-text-muted tabular-nums">
                    {formatBudget(project.budget)}
                </span>
            </td>

            {/* Due Date */}
            <td className="hidden xl:table-cell px-4 py-3.5">
                <span
                    className={cn(
                        "text-xs",
                        isOverdue ? "text-red-400 font-medium" : "text-sx-text-muted",
                    )}
                >
                    {dueDate}
                    {isOverdue && " ⚠"}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 text-right">
                <div ref={menuRef} className="relative inline-block">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                            setStatusMenuOpen(false);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpen && !statusMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onSelect();
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                View details
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStatusMenuOpen(true);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                Change status
                            </button>
                            <div className="my-1 h-px bg-white/[0.06]" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onDelete(project.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete project
                            </button>
                        </div>
                    )}

                    {menuOpen && statusMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {statusFlow.map((s) => (
                                <button
                                    key={s}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusChange(project.id, s);
                                        setMenuOpen(false);
                                        setStatusMenuOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                        project.status === s
                                            ? "bg-white/[0.06] text-white"
                                            : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    <ProjectStatusBadge status={s} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ────────────────────────────────────────────────────────────── */

function ProjectCard({
    project,
    index,
    onSelect,
}: {
    project: ProjectWithClient;
    index: number;
    onSelect: () => void;
}) {
    const companyName = project.clients?.company || "—";

    const dueDate = project.due_date
        ? new Date(project.due_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : null;

    const isOverdue =
        project.due_date &&
        new Date(project.due_date) < new Date() &&
        project.status !== "completed" &&
        project.status !== "cancelled";

    const progressColor =
        project.progress >= 100
            ? "bg-emerald-400"
            : project.progress >= 60
              ? "bg-violet-400"
              : project.progress >= 30
                ? "bg-amber-400"
                : "bg-blue-400";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            onClick={onSelect}
            className="cursor-pointer p-4 transition-colors hover:bg-white/[0.03]"
        >
            <div className="flex items-start justify-between mb-2.5">
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">{project.title}</p>
                    <div className="flex items-center gap-1.5 text-xs text-sx-text-subtle mt-0.5">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{companyName}</span>
                    </div>
                </div>
                <ProjectStatusBadge status={project.status as ProjectStatus} />
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className={cn("h-full rounded-full transition-all", progressColor)}
                        style={{ width: `${Math.min(100, project.progress)}%` }}
                    />
                </div>
                <span className="text-xs text-sx-text-muted tabular-nums shrink-0">
                    {project.progress}%
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-sx-text-muted">
                <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-sx-text-subtle" />
                    {project.service}
                </span>
                {dueDate && (
                    <span
                        className={cn(
                            "flex items-center gap-1",
                            isOverdue && "text-red-400",
                        )}
                    >
                        <Calendar className="h-3 w-3" />
                        {dueDate}
                    </span>
                )}
                {project.budget && (
                    <span className="text-sx-text-subtle tabular-nums">
                        {formatBudget(project.budget)}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

/* ── Empty State ────────────────────────────────────────────────────────────── */

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-20"
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 mb-4">
                <FolderKanban className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">No projects found</h3>
            <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                No projects match your current filters. Try adjusting your search or status filters to see more results.
            </p>
        </motion.div>
    );
}
