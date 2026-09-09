"use client";

/* -------------------------------------------------------------------------- */
/*                    PROJECT DETAIL DRAWER                                   */
/*                                                                            */
/*  Full-screen slide-over panel showing project details, progress slider,   */
/*  status control, and action buttons. Uses framer-motion AnimatePresence   */
/*  for smooth enter/exit transitions.                                       */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Briefcase,
    Building2,
    Calendar,
    DollarSign,
    ChevronDown,
    Trash2,
    User,
    FileText,
    Clock,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectWithClient, ProjectStatus } from "@/app/actions/projects";
import ProjectStatusBadge, { projectStatusConfig } from "./ProjectStatusBadge";

interface ProjectDetailDrawerProps {
    project: ProjectWithClient | null;
    open: boolean;
    onClose: () => void;
    onStatusChange: (id: string, status: ProjectStatus) => void;
    onProgressChange: (id: string, progress: number) => void;
    onDelete: (id: string) => void;
}

const allStatuses: ProjectStatus[] = ["pending", "active", "completed", "cancelled"];

function formatBudget(n: number | null): string {
    if (!n) return "—";
    return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(d: string | null, long = false): string {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: long ? "long" : "short",
        year: "numeric",
    });
}

export default function ProjectDetailDrawer({
    project,
    open,
    onClose,
    onStatusChange,
    onProgressChange,
    onDelete,
}: ProjectDetailDrawerProps) {
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [localProgress, setLocalProgress] = useState<number | null>(null);

    if (!project) return null;

    const clientName = project.clients?.users?.full_name || "Unknown";
    const companyName = project.clients?.company || "—";
    const clientEmail = project.clients?.users?.email || null;

    const isOverdue =
        project.due_date &&
        new Date(project.due_date) < new Date() &&
        project.status !== "completed" &&
        project.status !== "cancelled";

    const formattedUpdated = formatDate(project.updated_at);
    const currentProgress = localProgress !== null ? localProgress : project.progress;

    const progressColor =
        currentProgress >= 100
            ? "bg-emerald-400"
            : currentProgress >= 60
              ? "bg-violet-400"
              : currentProgress >= 30
                ? "bg-amber-400"
                : "bg-blue-400";

    const handleDelete = () => {
        if (confirmDelete) {
            onDelete(project.id);
            onClose();
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const handleProgressCommit = () => {
        if (localProgress !== null && localProgress !== project.progress) {
            onProgressChange(project.id, localProgress);
        }
        setLocalProgress(null);
    };

    // Calculate days remaining or overdue
    let daysLabel = "";
    if (project.due_date) {
        const diff = Math.ceil(
            (new Date(project.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        if (diff > 0) {
            daysLabel = `${diff} day${diff !== 1 ? "s" : ""} remaining`;
        } else if (diff === 0) {
            daysLabel = "Due today";
        } else {
            daysLabel = `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""} overdue`;
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-white/[0.06] bg-[#080e1e] shadow-2xl shadow-black/50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                                    <Briefcase className="h-4 w-4 text-violet-300" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-white truncate">
                                        {project.title}
                                    </h2>
                                    <p className="text-xs text-sx-text-subtle truncate">
                                        {companyName}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            {/* Progress section */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Progress
                                    </p>
                                    <span className="text-lg font-bold text-white tabular-nums">
                                        {currentProgress}%
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] mb-3">
                                    <motion.div
                                        className={cn("h-full rounded-full", progressColor)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, currentProgress)}%` }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                </div>

                                {/* Progress slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={5}
                                    value={currentProgress}
                                    onChange={(e) => setLocalProgress(Number(e.target.value))}
                                    onMouseUp={handleProgressCommit}
                                    onTouchEnd={handleProgressCommit}
                                    className="w-full accent-violet-500 cursor-pointer"
                                />
                            </div>

                            {/* Status section */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Status
                                    </p>
                                    <span className="text-[10px] text-sx-text-subtle">
                                        Updated {formattedUpdated}
                                    </span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                        className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.12]"
                                    >
                                        <ProjectStatusBadge
                                            status={project.status as ProjectStatus}
                                            size="md"
                                        />
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-sx-text-subtle transition-transform",
                                                statusDropdownOpen && "rotate-180",
                                            )}
                                        />
                                    </button>

                                    {statusDropdownOpen && (
                                        <div className="absolute left-0 right-0 top-full z-10 mt-1.5 rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                                            {allStatuses.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => {
                                                        onStatusChange(project.id, s);
                                                        setStatusDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                                        project.status === s
                                                            ? "bg-white/[0.06]"
                                                            : "hover:bg-white/[0.04]",
                                                    )}
                                                >
                                                    <ProjectStatusBadge status={s} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Status bar */}
                                <div className="mt-4 flex items-center gap-1">
                                    {allStatuses.slice(0, 3).map((s, i) => {
                                        const idx = allStatuses.indexOf(project.status as ProjectStatus);
                                        const isPast = i <= idx && project.status !== "cancelled";
                                        const cfg = projectStatusConfig[s];
                                        return (
                                            <div key={s} className="flex items-center gap-1 flex-1">
                                                <div
                                                    className={cn(
                                                        "h-1.5 w-full rounded-full transition-colors",
                                                        isPast ? cfg.dot : "bg-white/[0.06]",
                                                    )}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Project Details */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Project Details
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow
                                        icon={<Briefcase className="h-4 w-4" />}
                                        label="Service"
                                        value={project.service}
                                    />
                                    {project.description && (
                                        <InfoRow
                                            icon={<FileText className="h-4 w-4" />}
                                            label="Description"
                                            value={project.description}
                                        />
                                    )}
                                    <InfoRow
                                        icon={<DollarSign className="h-4 w-4" />}
                                        label="Budget"
                                        value={formatBudget(project.budget)}
                                    />
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Start Date"
                                        value={formatDate(project.start_date, true)}
                                    />
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Due Date"
                                        value={formatDate(project.due_date, true)}
                                        highlight={!!isOverdue}
                                    />
                                    {daysLabel && (
                                        <InfoRow
                                            icon={<Clock className="h-4 w-4" />}
                                            label="Timeline"
                                            value={daysLabel}
                                            highlight={!!isOverdue}
                                        />
                                    )}
                                </div>
                            </section>

                            {/* Client Information */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Client Information
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow
                                        icon={<Building2 className="h-4 w-4" />}
                                        label="Company"
                                        value={companyName}
                                    />
                                    <InfoRow
                                        icon={<User className="h-4 w-4" />}
                                        label="Contact"
                                        value={clientName}
                                    />
                                    {clientEmail && (
                                        <InfoRow
                                            icon={<TrendingUp className="h-4 w-4" />}
                                            label="Email"
                                            value={clientEmail}
                                            href={`mailto:${clientEmail}`}
                                        />
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Footer actions */}
                        <div className="border-t border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (project.status === "active") {
                                            onStatusChange(project.id, "completed");
                                        } else if (project.status === "pending") {
                                            onStatusChange(project.id, "active");
                                        }
                                    }}
                                    disabled={project.status === "completed" || project.status === "cancelled"}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-violet-400 hover:shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {project.status === "pending" ? "Start Project" : "Mark Complete"}
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={cn(
                                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                                        confirmDelete
                                            ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                            : "border-white/[0.06] bg-white/[0.02] text-sx-text-muted hover:border-red-500/20 hover:text-red-400",
                                    )}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {confirmDelete ? "Confirm" : "Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

/* ── Info Row ────────────────────────────────────────────────────────────────── */

function InfoRow({
    icon,
    label,
    value,
    href,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
    highlight?: boolean;
}) {
    const content = href ? (
        <a
            href={href}
            className="text-sm text-white hover:text-violet-400 transition-colors"
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
        >
            {value}
        </a>
    ) : (
        <span className={cn("text-sm", highlight ? "text-red-400 font-medium" : "text-white")}>
            {value}
        </span>
    );

    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-sx-text-subtle">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-sx-text-subtle">
                    {label}
                </p>
                {content}
            </div>
        </div>
    );
}
