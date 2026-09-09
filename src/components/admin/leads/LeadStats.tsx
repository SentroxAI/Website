"use client";

/* -------------------------------------------------------------------------- */
/*                          LEAD STATS                                        */
/*                                                                            */
/*  Top row of stat cards for the leads page.                                 */
/*  Shows total, new, qualified, and conversion rate.                         */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    BadgeCheck,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeadStatsData } from "@/app/actions/leads";

interface LeadStatsProps {
    stats: LeadStatsData;
}

const cards = [
    {
        key: "total" as const,
        label: "Total Leads",
        icon: <Users className="h-5 w-5" />,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        format: (s: LeadStatsData) => s.total.toString(),
    },
    {
        key: "new" as const,
        label: "New Leads",
        icon: <UserPlus className="h-5 w-5" />,
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        format: (s: LeadStatsData) => s.new.toString(),
    },
    {
        key: "qualified" as const,
        label: "Qualified",
        icon: <BadgeCheck className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (s: LeadStatsData) => s.qualified.toString(),
    },
    {
        key: "conversionRate" as const,
        label: "Conversion Rate",
        icon: <TrendingUp className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (s: LeadStatsData) => `${s.conversionRate}%`,
    },
];

export default function LeadStats({ stats }: LeadStatsProps) {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                        {card.key === "conversionRate" && stats.conversionRate > 0 && (
                            <span className="flex items-center gap-0.5 rounded-lg bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <ArrowUpRight className="h-2.5 w-2.5" />
                                {stats.conversionRate}%
                            </span>
                        )}
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
