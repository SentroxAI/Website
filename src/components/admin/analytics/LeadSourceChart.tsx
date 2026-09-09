"use client";

/* -------------------------------------------------------------------------- */
/*                    LEAD SOURCE DONUT CHART                                 */
/*                                                                            */
/*  SVG donut chart showing lead distribution by source.                     */
/*  No external chart library — pure SVG arcs.                               */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LeadsBySource } from "@/app/actions/analytics";

interface LeadSourceChartProps {
    data: LeadsBySource[];
    className?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function formatSource(source: string): string {
    return source
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function LeadSourceChart({ data, className }: LeadSourceChartProps) {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    if (total === 0) {
        return (
            <div className={cn("flex items-center justify-center h-[280px] text-sx-text-subtle text-sm", className)}>
                No lead data available
            </div>
        );
    }

    const cx = 100;
    const cy = 100;
    const radius = 72;
    const strokeWidth = 24;

    let currentAngle = 0;
    const arcs = data.map((item) => {
        const sweep = (item.count / total) * 360;
        // Avoid exact 360° arc (SVG can't draw it)
        const clampedSweep = Math.min(sweep, 359.99);
        const startAngle = currentAngle;
        const endAngle = currentAngle + clampedSweep;
        currentAngle += sweep;
        return { ...item, startAngle, endAngle };
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center lg:flex-row lg:items-start gap-6", className)}
        >
            {/* Donut */}
            <div className="relative shrink-0">
                <svg viewBox="0 0 200 200" width="200" height="200">
                    {/* Background ring */}
                    <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Arcs */}
                    {arcs.map((arc, i) => (
                        <motion.path
                            key={arc.source}
                            d={describeArc(cx, cy, radius, arc.startAngle, arc.endAngle)}
                            fill="none"
                            stroke={arc.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                    ))}
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{total}</span>
                    <span className="text-[10px] text-sx-text-muted">Total Leads</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2 min-w-0">
                {data.map((item) => {
                    const pct = ((item.count / total) * 100).toFixed(1);
                    return (
                        <div
                            key={item.source}
                            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.02] transition-colors"
                        >
                            <span
                                className="h-3 w-3 shrink-0 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="flex-1 text-sm text-sx-text-muted truncate">
                                {formatSource(item.source)}
                            </span>
                            <span className="text-sm font-medium text-white tabular-nums">
                                {item.count}
                            </span>
                            <span className="text-xs text-sx-text-subtle tabular-nums w-12 text-right">
                                {pct}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
