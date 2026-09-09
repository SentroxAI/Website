"use client";

/* -------------------------------------------------------------------------- */
/*                        ADMIN STAT CARDS                                    */
/*                                                                            */
/*  8-card grid showing key business metrics with trend indicators.           */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    DollarSign,
    Users,
    UserPlus,
    FolderKanban,
    Gauge,
    TrendingUp,
    Calendar,
    Rocket,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { statCards, type StatCard } from "./data";

const iconMap: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    revenue: { icon: <DollarSign className="h-5 w-5" />, bg: "bg-emerald-500/10", text: "text-emerald-400" },
    clients: { icon: <Users className="h-5 w-5" />, bg: "bg-blue-500/10", text: "text-blue-400" },
    leads: { icon: <UserPlus className="h-5 w-5" />, bg: "bg-violet-500/10", text: "text-violet-400" },
    projects: { icon: <FolderKanban className="h-5 w-5" />, bg: "bg-cyan-500/10", text: "text-cyan-400" },
    utilization: { icon: <Gauge className="h-5 w-5" />, bg: "bg-amber-500/10", text: "text-amber-400" },
    conversion: { icon: <TrendingUp className="h-5 w-5" />, bg: "bg-pink-500/10", text: "text-pink-400" },
    meetings: { icon: <Calendar className="h-5 w-5" />, bg: "bg-indigo-500/10", text: "text-indigo-400" },
    growth: { icon: <Rocket className="h-5 w-5" />, bg: "bg-orange-500/10", text: "text-orange-400" },
};

export default function AdminStatCards() {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => (
                <StatCardItem key={stat.id} stat={stat} index={index} />
            ))}
        </div>
    );
}

function StatCardItem({ stat, index }: { stat: StatCard; index: number }) {
    const config = iconMap[stat.id] || iconMap.revenue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
        >
            <div className="flex items-center justify-between mb-3">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", config.bg, config.text)}>
                    {config.icon}
                </div>
                <TrendBadge change={stat.change} trend={stat.trend} />
            </div>

            <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
                {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-sx-text-muted">
                {stat.label}
                <span className="text-sx-text-subtle ml-1">· {stat.period}</span>
            </p>
        </motion.div>
    );
}

function TrendBadge({ change, trend }: { change: number; trend: StatCard["trend"] }) {
    if (trend === "neutral") {
        return (
            <span className="flex items-center gap-0.5 rounded-lg bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-sx-text-subtle">
                <Minus className="h-2.5 w-2.5" />
                0%
            </span>
        );
    }

    return (
        <span
            className={cn(
                "flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-semibold",
                trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
            )}
        >
            {trend === "up" ? (
                <ArrowUpRight className="h-2.5 w-2.5" />
            ) : (
                <ArrowDownRight className="h-2.5 w-2.5" />
            )}
            {Math.abs(change)}%
        </span>
    );
}
