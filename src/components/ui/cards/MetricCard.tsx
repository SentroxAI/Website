"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface MetricCardProps {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    trend?: { value: number; label?: string };
    icon?: React.ReactNode;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                            ANIMATED COUNTER                                */
/* -------------------------------------------------------------------------- */

function useAnimatedCounter(
    end: number,
    duration: number = 1500,
    shouldStart: boolean = false
) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;

            const progress = Math.min(
                (timestamp - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            setCount(Math.floor(eased * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, shouldStart]);

    return count;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function MetricCard({
    label,
    value,
    suffix = "",
    prefix = "",
    trend,
    icon,
    className,
}: MetricCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const animatedValue = useAnimatedCounter(value, 1500, isInView);

    const trendIcon =
        trend && trend.value > 0 ? (
            <TrendingUp className="h-4 w-4" />
        ) : trend && trend.value < 0 ? (
            <TrendingDown className="h-4 w-4" />
        ) : (
            <Minus className="h-4 w-4" />
        );

    const trendColor =
        trend && trend.value > 0
            ? "text-emerald-400"
            : trend && trend.value < 0
              ? "text-red-400"
              : "text-slate-400";

    return (
        <motion.div
            ref={ref}
            whileHover={{
                y: -4,
                scale: 1.02,
                transition: { duration: 0.3 },
            }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
                className
            )}
        >
            {/* Glass Highlight */}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

            <div className="relative">
                {/* Top Row */}

                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-400">
                        {label}
                    </p>

                    {icon && (
                        <span className="text-blue-400">{icon}</span>
                    )}
                </div>

                {/* Value */}

                <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                    {prefix}
                    {animatedValue.toLocaleString()}
                    {suffix}
                </h3>

                {/* Trend */}

                {trend && (
                    <div
                        className={cn(
                            "mt-3 flex items-center gap-1 text-sm font-medium",
                            trendColor
                        )}
                    >
                        {trendIcon}

                        <span>
                            {trend.value > 0 && "+"}
                            {trend.value}%
                        </span>

                        {trend.label && (
                            <span className="ml-1 text-slate-500">
                                {trend.label}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
