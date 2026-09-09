"use client";

/* -------------------------------------------------------------------------- */
/*                       LEAD PIPELINE BAR                                    */
/*                                                                            */
/*  Horizontal segmented bar showing lead distribution across statuses.       */
/*  Compact visualization between stats and the main table.                   */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LeadStatsData } from "@/app/actions/leads";

interface LeadPipelineBarProps {
    stats: LeadStatsData;
    className?: string;
}

const segments = [
    { key: "new" as const, label: "New", from: "#3b82f6", to: "#60a5fa", text: "text-blue-400" },
    { key: "contacted" as const, label: "Contacted", from: "#06b6d4", to: "#22d3ee", text: "text-cyan-400" },
    { key: "qualified" as const, label: "Qualified", from: "#f59e0b", to: "#fbbf24", text: "text-amber-400" },
    { key: "converted" as const, label: "Converted", from: "#10b981", to: "#34d399", text: "text-emerald-400" },
    { key: "lost" as const, label: "Lost", from: "#ef4444", to: "#f87171", text: "text-red-400" },
];

export default function LeadPipelineBar({ stats, className }: LeadPipelineBarProps) {
    const total = stats.total || 1; // prevent division by zero

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4",
                className,
            )}
        >
            {/* Segmented bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.04] gap-0.5">
                {segments.map((seg, i) => {
                    const count = stats[seg.key] as number;
                    const pct = (count / total) * 100;
                    if (pct === 0) return null;

                    return (
                        <motion.div
                            key={seg.key}
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${seg.from}, ${seg.to})`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2 + i * 0.08,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                {segments.map((seg) => {
                    const count = stats[seg.key] as number;
                    return (
                        <div key={seg.key} className="flex items-center gap-1.5">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: seg.from }}
                            />
                            <span className="text-[11px] text-sx-text-muted">
                                {seg.label}
                            </span>
                            <span className={cn("text-[11px] font-semibold tabular-nums", seg.text)}>
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
