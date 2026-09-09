"use client";

/* -------------------------------------------------------------------------- */
/*                          REVENUE CHART                                     */
/*                                                                            */
/*  SVG area chart showing monthly revenue trend with gradient fill.          */
/*  Animated line drawing + fade-in.  No external charting library.           */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { revenueChartData, type ChartDataPoint } from "./data";

interface RevenueChartProps {
    className?: string;
}

function formatCurrency(value: number): string {
    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
}

function buildPath(data: ChartDataPoint[], width: number, height: number, padY = 24): string {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value)) * 0.85; // add some floor padding
    const range = maxValue - minValue;
    const stepX = width / (data.length - 1);

    return data
        .map((point, i) => {
            const x = i * stepX;
            const y = padY + (1 - (point.value - minValue) / range) * (height - padY * 2);
            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");
}

function buildAreaPath(data: ChartDataPoint[], width: number, height: number, padY = 24): string {
    const linePath = buildPath(data, width, height, padY);
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

export default function RevenueChart({ className }: RevenueChartProps) {
    const data = revenueChartData;
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const change = ((latest.value - previous.value) / previous.value) * 100;

    const svgWidth = 560;
    const svgHeight = 200;

    const linePath = buildPath(data, svgWidth, svgHeight);
    const areaPath = buildAreaPath(data, svgWidth, svgHeight);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                        Total Revenue
                    </p>
                    <p className="mt-1 text-2xl font-bold text-white tabular-nums">
                        {formatCurrency(latest.value)}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                        <span
                            className={cn(
                                "flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-semibold",
                                change >= 0
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                            )}
                        >
                            <TrendingUp className="h-2.5 w-2.5" />
                            {change >= 0 ? "+" : ""}
                            {change.toFixed(1)}%
                        </span>
                        <span className="text-[11px] text-sx-text-subtle">vs last month</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="relative" style={{ height: svgHeight }}>
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                >
                    <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {[0.25, 0.5, 0.75].map((ratio) => (
                        <line
                            key={ratio}
                            x1={0}
                            y1={svgHeight * ratio}
                            x2={svgWidth}
                            y2={svgHeight * ratio}
                            stroke="white"
                            strokeOpacity={0.04}
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Area fill */}
                    <motion.path
                        d={areaPath}
                        fill="url(#revenueGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    />

                    {/* Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="url(#revenueLineGrad)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    />

                    <defs>
                        <linearGradient id="revenueLineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>

                    {/* Data points */}
                    {data.map((point, i) => {
                        const maxValue = Math.max(...data.map((d) => d.value));
                        const minValue = Math.min(...data.map((d) => d.value)) * 0.85;
                        const range = maxValue - minValue;
                        const stepX = svgWidth / (data.length - 1);
                        const x = i * stepX;
                        const y = 24 + (1 - (point.value - minValue) / range) * (svgHeight - 48);
                        const isLast = i === data.length - 1;

                        return (
                            <motion.circle
                                key={point.label}
                                cx={x}
                                cy={y}
                                r={isLast ? 5 : 3}
                                fill={isLast ? "#f97316" : "#ef4444"}
                                stroke={isLast ? "#f97316" : "transparent"}
                                strokeWidth={isLast ? 2 : 0}
                                strokeOpacity={0.3}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.8 + i * 0.08 }}
                            />
                        );
                    })}
                </svg>
            </div>

            {/* Month labels */}
            <div className="flex justify-between mt-2 px-0">
                {data.map((point, i) => (
                    <span
                        key={point.label}
                        className={cn(
                            "text-[10px] tabular-nums",
                            i === data.length - 1
                                ? "text-white font-medium"
                                : "text-sx-text-subtle"
                        )}
                    >
                        {point.label}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
