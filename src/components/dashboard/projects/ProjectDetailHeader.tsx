"use client";

/* -------------------------------------------------------------------------- */
/*                     PROJECT DETAIL HEADER                                  */
/*                                                                            */
/*  Top section of the detail page: title, description, status, metadata.     */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, DollarSign, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { getTaskStats, type Project } from "./data";

function formatDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

interface ProjectDetailHeaderProps {
    project: Project;
}

export default function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
    const taskStats = getTaskStats(project);
    const budgetPct =
        project.budget > 0
            ? Math.round((project.budgetUsed / project.budget) * 100)
            : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Back link */}
            <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-sx-text-muted hover:text-sx-primary-400 transition-colors mb-4"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Projects
            </Link>

            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                {/* Title + Status */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-white md:text-2xl">
                            {project.title}
                        </h1>
                        <p className="mt-1 text-sm text-sx-text-muted">{project.service}</p>
                    </div>
                    <ProjectStatusBadge status={project.status} />
                </div>

                {/* Description */}
                <p className="text-sm text-sx-text-muted leading-relaxed mb-6">
                    {project.description}
                </p>

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-sx-text-muted">
                            {taskStats.completed}/{taskStats.total} tasks completed
                        </span>
                        <span className="text-sm font-semibold text-white tabular-nums">
                            {project.progress}%
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className={cn(
                                "h-full rounded-full",
                                project.status === "completed"
                                    ? "bg-emerald-500"
                                    : "bg-gradient-to-r from-blue-500 to-cyan-400"
                            )}
                        />
                    </div>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 text-sx-text-subtle mb-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Timeline</span>
                        </div>
                        <p className="text-xs font-semibold text-sx-text-secondary">
                            {formatDate(project.startDate)}
                        </p>
                        <p className="text-[11px] text-sx-text-muted">
                            → {formatDate(project.dueDate)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 text-sx-text-subtle mb-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Budget</span>
                        </div>
                        <p className="text-xs font-semibold text-sx-text-secondary">
                            {formatCurrency(project.budgetUsed)}
                        </p>
                        <p className="text-[11px] text-sx-text-muted">
                            of {formatCurrency(project.budget)} ({budgetPct}%)
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 text-sx-text-subtle mb-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Tasks</span>
                        </div>
                        <p className="text-xs font-semibold text-sx-text-secondary">
                            {taskStats.completed} done
                        </p>
                        <p className="text-[11px] text-sx-text-muted">
                            {taskStats.remaining} remaining
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 text-sx-text-subtle mb-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Client</span>
                        </div>
                        <p className="text-xs font-semibold text-sx-text-secondary">
                            {project.client}
                        </p>
                        <div className="mt-1 flex -space-x-1.5">
                            {project.team.slice(0, 4).map((m) => (
                                <Avatar key={m.id} fallback={m.name} size="xs" className="ring-2 ring-[#0a0f1e]" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
