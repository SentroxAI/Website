"use client";

/* -------------------------------------------------------------------------- */
/*                        TOP CLIENTS TABLE                                   */
/*                                                                            */
/*  Compact table showing top 5 clients by revenue with status badges.        */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { topClients, type TopClient } from "./data";

export default function TopClientsTable({ className }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden",
                className
            )}
        >
            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_5rem_3.5rem_4rem] gap-3 px-5 py-3 border-b border-white/[0.04] text-[10px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                <span>#</span>
                <span>Client</span>
                <span className="text-right">Revenue</span>
                <span className="text-center">Projects</span>
                <span className="text-right">Status</span>
            </div>

            {/* Rows */}
            <div>
                {topClients.map((client, index) => (
                    <ClientRow key={client.id} client={client} rank={index + 1} index={index} />
                ))}
            </div>
        </motion.div>
    );
}

function ClientRow({
    client,
    rank,
    index,
}: {
    client: TopClient;
    rank: number;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.06 }}
            className={cn(
                "grid grid-cols-[2rem_1fr_5rem_3.5rem_4rem] gap-3 px-5 py-3 items-center transition-colors hover:bg-white/[0.03]",
                index < topClients.length - 1 && "border-b border-white/[0.03]"
            )}
        >
            {/* Rank */}
            <span
                className={cn(
                    "flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold tabular-nums",
                    rank <= 3
                        ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 text-orange-400"
                        : "bg-white/[0.04] text-sx-text-subtle"
                )}
            >
                {rank}
            </span>

            {/* Name */}
            <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{client.name}</p>
            </div>

            {/* Revenue */}
            <p className="text-sm font-semibold text-white tabular-nums text-right">
                {client.revenue}
            </p>

            {/* Projects count */}
            <p className="text-sm text-sx-text-muted tabular-nums text-center">
                {client.projects}
            </p>

            {/* Status badge */}
            <div className="flex justify-end">
                <span
                    className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        client.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/[0.04] text-sx-text-subtle"
                    )}
                >
                    {client.status === "active" ? "Active" : "Inactive"}
                </span>
            </div>
        </motion.div>
    );
}
