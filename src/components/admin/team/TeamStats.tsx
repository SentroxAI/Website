"use client";

/* -------------------------------------------------------------------------- */
/*                          TEAM STATS                                        */
/*                                                                            */
/*  Top row of stat cards for the team page.                                  */
/*  Shows total members, admins, and team members.                           */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { UsersRound, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamStatsData } from "@/app/actions/team";

interface TeamStatsProps {
    stats: TeamStatsData;
}

const cards = [
    {
        key: "total" as const,
        label: "Total Members",
        icon: <UsersRound className="h-5 w-5" />,
        bg: "bg-pink-500/10",
        text: "text-pink-400",
        format: (s: TeamStatsData) => s.total.toString(),
    },
    {
        key: "admins" as const,
        label: "Admins",
        icon: <Shield className="h-5 w-5" />,
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        format: (s: TeamStatsData) => s.admins.toString(),
    },
    {
        key: "teamMembers" as const,
        label: "Team Members",
        icon: <User className="h-5 w-5" />,
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        format: (s: TeamStatsData) => s.teamMembers.toString(),
    },
];

export default function TeamStats({ stats }: TeamStatsProps) {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
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
