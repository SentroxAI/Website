"use client";

/* -------------------------------------------------------------------------- */
/*                  MONTHLY TRENDS BAR CHART                                  */
/*                                                                            */
/*  Grouped bar chart showing leads, clients, and projects over 6 months.    */
/*  Pure SVG — no external charting library.                                  */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MonthlyData } from "@/app/actions/analytics";

interface MonthlyTrendsChartProps {
    data: MonthlyData[];
    className?: string;
}

const series = [
    { key: "leads" as const, label: "Leads", color: "#06b6d4" },
    { key: "clients" as const, label: "Clients", color: "#10b981" },
    { key: "projects" as const, label: "Projects", color: "#8b5cf6" },
];

export default function MonthlyTrendsChart({ data, className }: MonthlyTrendsChartProps) {
    const allValues = data.flatMap((d) => [d.leads, d.clients, d.projects]);
    const maxValue = Math.max(...allValues, 1);

    const chartW = 600;
    const chartH = 200;
    const padLeft = 32;
    const padBottom = 28;
    const padTop = 8;
    const barGroupWidth = (chartW - padLeft) / data.length;
    const barWidth = Math.min(16, barGroupWidth / 4);
    const barGap = 3;

    // Y axis grid lines
    const gridLines = 4;
    const yStep = (chartH - padTop - padBottom) / gridLines;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("space-y-4", className)}
        >
            {/* Legend */}
            <div className="flex items-center gap-4">
                {series.map((s) => (
                    <div key={s.key} className="flex items-center gap-1.5">
                        <span
                            className="h-2.5 w-2.5 rounded-sm"
                            style={{ backgroundColor: s.color }}
                        />
                        <span className="text-[11px] text-sx-text-muted">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full min-w-[400px]" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    {Array.from({ length: gridLines + 1 }).map((_, i) => {
                        const y = padTop + i * yStep;
                        const value = Math.round(maxValue * (1 - i / gridLines));
                        return (
                            <g key={i}>
                                <line
                                    x1={padLeft}
                                    y1={y}
                                    x2={chartW}
                                    y2={y}
                                    stroke="rgba(255,255,255,0.04)"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padLeft - 4}
                                    y={y + 3}
                                    fill="rgba(255,255,255,0.25)"
                                    fontSize="9"
                                    textAnchor="end"
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    })}

                    {/* Bars */}
                    {data.map((d, groupIdx) => {
                        const groupX = padLeft + groupIdx * barGroupWidth + barGroupWidth / 2;
                        const totalBarsWidth = series.length * barWidth + (series.length - 1) * barGap;
                        const startX = groupX - totalBarsWidth / 2;

                        return (
                            <g key={d.month}>
                                {series.map((s, sIdx) => {
                                    const value = d[s.key];
                                    const barH = maxValue > 0
                                        ? (value / maxValue) * (chartH - padTop - padBottom)
                                        : 0;
                                    const x = startX + sIdx * (barWidth + barGap);
                                    const y = chartH - padBottom - barH;

                                    return (
                                        <motion.rect
                                            key={s.key}
                                            x={x}
                                            y={y}
                                            width={barWidth}
                                            height={barH}
                                            rx={barWidth / 2}
                                            fill={s.color}
                                            opacity={0.85}
                                            initial={{ height: 0, y: chartH - padBottom }}
                                            animate={{ height: barH, y }}
                                            transition={{ duration: 0.6, delay: groupIdx * 0.08 + sIdx * 0.04 }}
                                        />
                                    );
                                })}
                                {/* Month label */}
                                <text
                                    x={groupX}
                                    y={chartH - 6}
                                    fill="rgba(255,255,255,0.35)"
                                    fontSize="10"
                                    textAnchor="middle"
                                >
                                    {d.month}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </motion.div>
    );
}
