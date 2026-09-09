"use client";

/* -------------------------------------------------------------------------- */
/*                 PROJECT STATUS DISTRIBUTION                                */
/*                                                                            */
/*  Horizontal stacked bars showing project counts by status.                */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectsByStatus } from "@/app/actions/analytics";

interface ProjectStatusChartProps {
    data: ProjectsByStatus[];
    className?: string;
}

function formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function ProjectStatusChart({ data, className }: ProjectStatusChartProps) {
    const total = data.reduce((sum, d) => sum + d.count, 0);

    if (total === 0) {
        return (
            <div className={cn("flex items-center justify-center h-[160px] text-sx-text-subtle text-sm", className)}>
                No project data available
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("space-y-4", className)}
        >
            {/* Stacked bar */}
            <div className="flex h-6 w-full overflow-hidden rounded-full bg-white/[0.03]">
                {data.map((item, i) => {
                    const pct = (item.count / total) * 100;
                    return (
                        <motion.div
                            key={item.status}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="h-full"
                            style={{ backgroundColor: item.color }}
                            title={`${formatStatus(item.status)}: ${item.count}`}
                        />
                    );
                })}
            </div>

            {/* Legend rows */}
            <div className="grid gap-2 grid-cols-2">
                {data.map((item) => {
                    const pct = ((item.count / total) * 100).toFixed(0);
                    return (
                        <div
                            key={item.status}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.02] transition-colors"
                        >
                            <span
                                className="h-3 w-3 shrink-0 rounded-sm"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="flex-1 text-sm text-sx-text-muted">
                                {formatStatus(item.status)}
                            </span>
                            <span className="text-sm font-semibold text-white tabular-nums">
                                {item.count}
                            </span>
                            <span className="text-xs text-sx-text-subtle tabular-nums">
                                {pct}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
