"use client";

/* -------------------------------------------------------------------------- */
/*                             STATS CARD                                     */
/*                                                                            */
/*  Individual metric card with:                                              */
/*  - Animated counter                                                        */
/*  - Trend indicator (up/down %)                                             */
/*  - Mini sparkline                                                          */
/*  - Glassmorphism styling                                                   */
/*  - Hover lift effect                                                       */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    FolderKanban,
    CheckCircle2,
    MessageSquare,
    Calendar,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatItem } from "./data";

/* ── Icon mapping ──────────────────────────────────────────────────────────── */

const iconMap: Record<string, React.ReactNode> = {
    FolderKanban: <FolderKanban className="h-5 w-5" />,
    CheckCircle2: <CheckCircle2 className="h-5 w-5" />,
    MessageSquare: <MessageSquare className="h-5 w-5" />,
    Calendar: <Calendar className="h-5 w-5" />,
};

/* ── Color mapping ─────────────────────────────────────────────────────────── */

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
    blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        glow: "shadow-blue-500/20",
    },
    emerald: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/20",
    },
    cyan: {
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        glow: "shadow-cyan-500/20",
    },
    violet: {
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        glow: "shadow-violet-500/20",
    },
};

/* ── Animated counter hook ─────────────────────────────────────────────────── */

function useAnimatedCounter(target: number, duration = 1200): number {
    const [count, setCount] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const start = performance.now();
        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);

    return count;
}

/* ── Mini sparkline SVG ────────────────────────────────────────────────────── */

function Sparkline({
    data,
    color,
}: {
    data: number[];
    color: string;
}) {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 28;
    const padding = 2;

    const points = data
        .map((val, i) => {
            const x = padding + (i / (data.length - 1)) * (width - padding * 2);
            const y = padding + (1 - (val - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        })
        .join(" ");

    const strokeColor =
        color === "blue"
            ? "#3b82f6"
            : color === "emerald"
            ? "#10b981"
            : color === "cyan"
            ? "#06b6d4"
            : "#8b5cf6";

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            className="opacity-60"
        >
            <polyline
                points={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface StatsCardProps {
    stat: StatItem;
    index: number;
}

export default function StatsCard({ stat, index }: StatsCardProps) {
    const animatedValue = useAnimatedCounter(stat.value, 1200 + index * 200);
    const colors = colorMap[stat.color] || colorMap.blue;

    // Calculate trend
    const trend =
        stat.previousValue !== undefined && stat.previousValue > 0
            ? ((stat.value - stat.previousValue) / stat.previousValue) * 100
            : 0;
    const trendUp = trend >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-5",
                "border border-white/[0.06] bg-white/[0.02]",
                "backdrop-blur-sm",
                "transition-all duration-300",
                "hover:border-white/[0.12] hover:bg-white/[0.04]",
                "hover:shadow-lg hover:-translate-y-0.5",
                colors.glow
            )}
        >
            {/* Gradient glow on hover */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    `bg-gradient-to-br from-${stat.color}-500/[0.08] to-transparent`
                )}
            />

            <div className="relative flex items-start justify-between">
                {/* Left: icon + content */}
                <div className="flex-1">
                    {/* Icon */}
                    <div
                        className={cn(
                            "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                            colors.bg,
                            colors.text
                        )}
                    >
                        {iconMap[stat.icon] || <FolderKanban className="h-5 w-5" />}
                    </div>

                    {/* Label */}
                    <p className="text-xs font-medium text-sx-text-muted mb-1">
                        {stat.label}
                    </p>

                    {/* Animated value */}
                    <p className="text-2xl font-bold text-white tabular-nums">
                        {animatedValue}
                    </p>

                    {/* Trend */}
                    {stat.previousValue !== undefined && (
                        <div className="mt-2 flex items-center gap-1">
                            {trendUp ? (
                                <TrendingUp className="h-3 w-3 text-emerald-400" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-400" />
                            )}
                            <span
                                className={cn(
                                    "text-[11px] font-medium",
                                    trendUp ? "text-emerald-400" : "text-red-400"
                                )}
                            >
                                {trendUp ? "+" : ""}
                                {trend.toFixed(1)}%
                            </span>
                            <span className="text-[11px] text-sx-text-subtle">
                                vs last period
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: sparkline */}
                {stat.sparkline && (
                    <div className="mt-6">
                        <Sparkline data={stat.sparkline} color={stat.color} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
