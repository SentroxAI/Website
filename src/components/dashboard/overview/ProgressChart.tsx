"use client";

/* -------------------------------------------------------------------------- */
/*                          PROGRESS CHART                                    */
/*                                                                            */
/*  Radial progress chart showing overall project completion.                 */
/*  Animated SVG circle with status breakdown legend.                         */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { progressSummary } from "./data";

/* ── Status config ─────────────────────────────────────────────────────────── */

const statusConfig = [
    { key: "completed", label: "Completed", color: "bg-emerald-500", textColor: "text-emerald-400" },
    { key: "inProgress", label: "In Progress", color: "bg-blue-500", textColor: "text-blue-400" },
    { key: "pending", label: "Pending", color: "bg-amber-500", textColor: "text-amber-400" },
    { key: "onHold", label: "On Hold", color: "bg-slate-500", textColor: "text-slate-400" },
] as const;

/* ── Animated counter ──────────────────────────────────────────────────────── */

function useAnimatedValue(target: number, duration = 1500): number {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const start = performance.now();
        let raf: number;

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) {
                raf = requestAnimationFrame(animate);
            }
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);

    return value;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function ProgressChart() {
    const { total, overallCompletion } = progressSummary;
    const animatedCompletion = useAnimatedValue(overallCompletion);

    // SVG circle config
    const size = 160;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (overallCompletion / 100) * circumference;

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* Radial chart */}
                <div className="relative flex shrink-0 items-center justify-center">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="-rotate-90"
                    >
                        {/* Background track */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress arc */}
                        <motion.circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="url(#progress-gradient)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{
                                duration: 1.5,
                                delay: 0.3,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                        />
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient
                                id="progress-gradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white tabular-nums">
                            {animatedCompletion}%
                        </span>
                        <span className="text-[11px] text-sx-text-muted">
                            Complete
                        </span>
                    </div>
                </div>

                {/* Status breakdown */}
                <div className="flex-1 space-y-3 w-full">
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-white">
                            Project Overview
                        </p>
                        <p className="text-xs text-sx-text-muted mt-0.5">
                            {total} total projects across all statuses
                        </p>
                    </div>

                    {statusConfig.map((status) => {
                        const count = progressSummary[status.key as keyof typeof progressSummary] as number;
                        const pct = total > 0 ? (count / total) * 100 : 0;

                        return (
                            <div key={status.key} className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "h-2.5 w-2.5 rounded-full shrink-0",
                                        status.color
                                    )}
                                />
                                <span className="flex-1 text-xs text-sx-text-muted">
                                    {status.label}
                                </span>
                                <span className="text-xs font-semibold text-sx-text-secondary tabular-nums">
                                    {count}
                                </span>
                                <span className="text-[11px] text-sx-text-subtle tabular-nums w-10 text-right">
                                    {pct.toFixed(0)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
