"use client";

/* -------------------------------------------------------------------------- */
/*                         MINI BAR CHART                                     */
/*                                                                            */
/*  Lightweight SVG bar chart for the admin overview.                         */
/*  No external charting library needed.                                      */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChartDataPoint } from "./data";

interface MiniBarChartProps {
    data: ChartDataPoint[];
    title: string;
    subtitle?: string;
    color?: string;
    formatValue?: (value: number) => string;
    className?: string;
}

export default function MiniBarChart({
    data,
    title,
    subtitle,
    color = "#6366f1",
    formatValue = (v) => v.toString(),
    className,
}: MiniBarChartProps) {
    const maxValue = Math.max(...data.map((d) => d.value));
    const chartHeight = 140;
    const barWidth = 100 / data.length;

    // Latest value for the header
    const latest = data[data.length - 1];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                        {title}
                    </p>
                    <p className="mt-1 text-xl font-bold text-white tabular-nums">
                        {formatValue(latest.value)}
                    </p>
                    {subtitle && (
                        <p className="text-[11px] text-sx-text-muted mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="relative" style={{ height: chartHeight }}>
                <svg
                    viewBox={`0 0 ${data.length * 100} ${chartHeight}`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    {data.map((point, i) => {
                        const barHeight = (point.value / maxValue) * (chartHeight - 20);
                        const x = i * 100 + 15;
                        const y = chartHeight - barHeight;
                        const isLast = i === data.length - 1;

                        return (
                            <motion.rect
                                key={point.label}
                                x={x}
                                y={chartHeight}
                                width={70}
                                height={0}
                                rx={6}
                                fill={isLast ? color : `${color}33`}
                                animate={{ y, height: barHeight }}
                                transition={{
                                    duration: 0.6,
                                    delay: i * 0.08,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-2 px-1">
                {data.map((point, i) => (
                    <span
                        key={point.label}
                        className={cn(
                            "text-[10px] tabular-nums",
                            i === data.length - 1 ? "text-white font-medium" : "text-sx-text-subtle"
                        )}
                    >
                        {point.label}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
