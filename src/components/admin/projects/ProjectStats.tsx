"use client";

/* -------------------------------------------------------------------------- */
/*                          PROJECT STATS                                     */
/*                                                                            */
/*  Top row of stat cards for the projects page.                              */
/*  Shows total, active, completed, pending, avg progress, total budget.     */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    FolderKanban,
    Activity,
    CheckCircle2,
    Clock,
    TrendingUp,
    DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectStatsData } from "@/app/actions/projects";

interface ProjectStatsProps {
    stats: ProjectStatsData;
}

function formatBudget(n: number): string {
    if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
    return `₹${n}`;
}

const cards = [
    {
        key: "total" as const,
        label: "Total Projects",
        icon: <FolderKanban className="h-5 w-5" />,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        format: (s: ProjectStatsData) => s.total.toString(),
    },
    {
        key: "active" as const,
        label: "Active",
        icon: <Activity className="h-5 w-5" />,
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        format: (s: ProjectStatsData) => s.active.toString(),
    },
    {
        key: "completed" as const,
        label: "Completed",
        icon: <CheckCircle2 className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (s: ProjectStatsData) => s.completed.toString(),
    },
    {
        key: "pending" as const,
        label: "Pending",
        icon: <Clock className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (s: ProjectStatsData) => s.pending.toString(),
    },
    {
        key: "avgProgress" as const,
        label: "Avg Progress",
        icon: <TrendingUp className="h-5 w-5" />,
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        format: (s: ProjectStatsData) => `${s.avgProgress}%`,
    },
    {
        key: "totalBudget" as const,
        label: "Total Budget",
        icon: <DollarSign className="h-5 w-5" />,
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        format: (s: ProjectStatsData) => formatBudget(s.totalBudget),
    },
];

export default function ProjectStats({ stats }: ProjectStatsProps) {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl",
                                card.bg,
                                card.text,
                            )}
                        >
                            {card.icon}
                        </div>
                    </div>

                    <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
                        {card.format(stats)}
                    </p>
                    <p className="mt-0.5 text-xs text-sx-text-muted">
                        {card.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
