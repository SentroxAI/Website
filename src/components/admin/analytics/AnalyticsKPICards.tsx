"use client";

/* -------------------------------------------------------------------------- */
/*                     ANALYTICS KPI CARDS                                    */
/*                                                                            */
/*  Top row of 8 key performance indicator cards.                            */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    UserPlus,
    Users,
    FolderKanban,
    FileText,
    UsersRound,
    IndianRupee,
    ArrowRightLeft,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsKPI } from "@/app/actions/analytics";

interface AnalyticsKPICardsProps {
    kpi: AnalyticsKPI;
}

function formatCurrency(value: number): string {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toLocaleString("en-IN")}`;
}

const cards = [
    {
        key: "totalLeads" as const,
        label: "Total Leads",
        icon: <UserPlus className="h-5 w-5" />,
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        format: (k: AnalyticsKPI) => k.totalLeads.toString(),
    },
    {
        key: "totalClients" as const,
        label: "Total Clients",
        icon: <Users className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (k: AnalyticsKPI) => k.totalClients.toString(),
    },
    {
        key: "conversionRate" as const,
        label: "Conversion Rate",
        icon: <ArrowRightLeft className="h-5 w-5" />,
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        format: (k: AnalyticsKPI) => `${k.conversionRate}%`,
    },
    {
        key: "totalProjects" as const,
        label: "Total Projects",
        icon: <FolderKanban className="h-5 w-5" />,
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        format: (k: AnalyticsKPI) => k.totalProjects.toString(),
    },
    {
        key: "avgProgress" as const,
        label: "Avg Progress",
        icon: <Activity className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (k: AnalyticsKPI) => `${k.avgProjectProgress}%`,
    },
    {
        key: "totalRevenue" as const,
        label: "Total Budget",
        icon: <IndianRupee className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (k: AnalyticsKPI) => formatCurrency(k.totalRevenue),
    },
    {
        key: "totalPosts" as const,
        label: "Blog Posts",
        icon: <FileText className="h-5 w-5" />,
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        format: (k: AnalyticsKPI) => k.totalPosts.toString(),
    },
    {
        key: "totalTeam" as const,
        label: "Team Members",
        icon: <UsersRound className="h-5 w-5" />,
        bg: "bg-pink-500/10",
        text: "text-pink-400",
        format: (k: AnalyticsKPI) => k.totalTeam.toString(),
    },
];

export default function AnalyticsKPICards({ kpi }: AnalyticsKPICardsProps) {
    return (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
            {cards.map((card, index) => (
                <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
                >
                    <div
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl mb-2.5",
                            card.bg,
                            card.text,
                        )}
                    >
                        {card.icon}
                    </div>
                    <p className="text-xl font-bold text-white tabular-nums tracking-tight">
                        {card.format(kpi)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-sx-text-muted leading-tight">
                        {card.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
