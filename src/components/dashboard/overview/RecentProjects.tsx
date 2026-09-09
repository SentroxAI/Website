"use client";

/* -------------------------------------------------------------------------- */
/*                         RECENT PROJECTS                                    */
/*                                                                            */
/*  Project cards with name, status badge, animated progress bar,             */
/*  due date, team avatars, and budget usage.                                 */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { CalendarDays, DollarSign, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/components/ui/Avatar";
import { projectsData, type ProjectItem } from "./data";
import EmptyState from "./EmptyState";

/* ── Status badge config ───────────────────────────────────────────────────── */

const statusConfig: Record<
    ProjectItem["status"],
    { label: string; variant: "success" | "info" | "warning" | "secondary" }
> = {
    completed: { label: "Completed", variant: "success" },
    "in-progress": { label: "In Progress", variant: "info" },
    pending: { label: "Pending", variant: "warning" },
    "on-hold": { label: "On Hold", variant: "secondary" },
};

/* ── Date formatter ────────────────────────────────────────────────────────── */

function formatDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/* ── Currency formatter ────────────────────────────────────────────────────── */

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function RecentProjects() {
    if (projectsData.length === 0) {
        return (
            <EmptyState
                icon={<FolderKanban className="h-6 w-6" />}
                title="No projects yet"
                description="Your active projects will appear here once they're created."
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="divide-y divide-white/[0.04]">
                {projectsData.slice(0, 5).map((project, index) => {
                    const status = statusConfig[project.status];
                    const budgetPct =
                        project.budget > 0
                            ? Math.round(
                                  (project.budgetUsed / project.budget) * 100
                              )
                            : 0;

                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.06,
                                ease: "easeOut",
                            }}
                            className="group px-5 py-4 transition-colors hover:bg-white/[0.02] cursor-pointer"
                        >
                            {/* Top row: name + status */}
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-white truncate pr-3">
                                    {project.name}
                                </h3>
                                <Badge variant={status.variant} size="sm">
                                    {status.label}
                                </Badge>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] text-sx-text-muted">
                                        Progress
                                    </span>
                                    <span className="text-[11px] font-semibold text-sx-text-secondary tabular-nums">
                                        {project.progress}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${project.progress}%`,
                                        }}
                                        transition={{
                                            duration: 1,
                                            delay: 0.3 + index * 0.1,
                                            ease: [0.25, 0.1, 0.25, 1],
                                        }}
                                        className={cn(
                                            "h-full rounded-full",
                                            project.progress === 100
                                                ? "bg-emerald-500"
                                                : project.progress > 60
                                                ? "bg-blue-500"
                                                : project.progress > 30
                                                ? "bg-cyan-500"
                                                : "bg-amber-500"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Bottom row: metadata */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-sx-text-muted">
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {formatDate(project.dueDate)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {formatCurrency(project.budgetUsed)} / {formatCurrency(project.budget)}
                                    </span>
                                </div>

                                {/* Team avatars */}
                                <div className="flex -space-x-2">
                                    {project.team.slice(0, 3).map((member) => (
                                        <Avatar
                                            key={member}
                                            fallback={member}
                                            size="xs"
                                            className="ring-2 ring-[#0a0f1e]"
                                        />
                                    ))}
                                    {project.team.length > 3 && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-[9px] font-semibold text-sx-text-muted ring-2 ring-[#0a0f1e]">
                                            +{project.team.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
