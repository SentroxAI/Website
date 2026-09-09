"use client";

/* -------------------------------------------------------------------------- */
/*                          CLIENT STATS                                      */
/*                                                                            */
/*  Top row of stat cards for the clients page.                               */
/*  Shows total, active, pending, and inactive counts.                        */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    Clock,
    UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientStatsData } from "@/app/actions/clients";

interface ClientStatsProps {
    stats: ClientStatsData;
}

const cards = [
    {
        key: "total" as const,
        label: "Total Clients",
        icon: <Users className="h-5 w-5" />,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        format: (s: ClientStatsData) => s.total.toString(),
    },
    {
        key: "active" as const,
        label: "Active",
        icon: <UserCheck className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (s: ClientStatsData) => s.active.toString(),
    },
    {
        key: "pending" as const,
        label: "Pending",
        icon: <Clock className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (s: ClientStatsData) => s.pending.toString(),
    },
    {
        key: "inactive" as const,
        label: "Inactive",
        icon: <UserX className="h-5 w-5" />,
        bg: "bg-zinc-500/10",
        text: "text-zinc-400",
        format: (s: ClientStatsData) => s.inactive.toString(),
    },
];

export default function ClientStats({ stats }: ClientStatsProps) {
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
