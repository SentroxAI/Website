"use client";

/* -------------------------------------------------------------------------- */
/*                         PROJECT CARD                                       */
/*                                                                            */
/*  Card for the projects grid/list view.                                     */
/*  Shows: title, service tag, status, progress bar, budget, team, due date.  */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { getTaskStats, type Project } from "./data";

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function formatDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const taskStats = getTaskStats(project);
    const budgetPct =
        project.budget > 0
            ? Math.round((project.budgetUsed / project.budget) * 100)
            : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
        >
            <Link
                href={`/dashboard/projects/${project.id}`}
                className={cn(
                    "group block overflow-hidden rounded-2xl",
                    "border border-white/[0.06] bg-white/[0.02]",
                    "transition-all duration-300",
                    "hover:border-white/[0.12] hover:bg-white/[0.04]",
                    "hover:shadow-lg hover:-translate-y-0.5"
                )}
            >
                {/* Progress accent bar at top */}
                <div className="h-1 bg-white/[0.04]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                        className={cn(
                            "h-full",
                            project.status === "completed"
                                ? "bg-emerald-500"
                                : project.status === "cancelled"
                                ? "bg-red-500/50"
                                : project.progress > 60
                                ? "bg-blue-500"
                                : "bg-cyan-500"
                        )}
                    />
                </div>

                <div className="p-5">
                    {/* Header: title + status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-white truncate group-hover:text-sx-primary-400 transition-colors">
                                {project.title}
                            </h3>
                            <p className="mt-0.5 text-xs text-sx-text-subtle">
                                {project.service}
                            </p>
                        </div>
                        <ProjectStatusBadge status={project.status} size="sm" />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-sx-text-muted line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] text-sx-text-muted">
                                {taskStats.completed}/{taskStats.total} tasks
                            </span>
                            <span className="text-[11px] font-semibold text-sx-text-secondary tabular-nums">
                                {project.progress}%
                            </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{
                                    duration: 1,
                                    delay: 0.4 + index * 0.08,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                                className={cn(
                                    "h-full rounded-full",
                                    project.status === "completed"
                                        ? "bg-emerald-500"
                                        : project.status === "cancelled"
                                        ? "bg-red-500/50"
                                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
                                )}
                            />
                        </div>
                    </div>

                    {/* Footer: metadata + team */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-sx-text-muted">
                            <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {formatDate(project.dueDate)}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {formatCurrency(project.budgetUsed)}
                                <span className="text-sx-text-subtle">
                                    ({budgetPct}%)
                                </span>
                            </span>
                        </div>

                        {/* Team */}
                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1.5">
                                {project.team.slice(0, 3).map((member) => (
                                    <Avatar
                                        key={member.id}
                                        fallback={member.name}
                                        src={member.avatar}
                                        size="xs"
                                        className="ring-2 ring-[#0a0f1e]"
                                    />
                                ))}
                            </div>
                            {project.team.length > 3 && (
                                <span className="text-[10px] text-sx-text-subtle">
                                    +{project.team.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
