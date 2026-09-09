"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              PROGRESS BAR                                  */
/* -------------------------------------------------------------------------- */

interface ProgressBarProps {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "gradient" | "success" | "warning" | "danger";
    label?: string;
    showValue?: boolean;
    animated?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
};

const variantStyles = {
    default: "bg-blue-600",
    gradient: "bg-gradient-to-r from-blue-600 to-cyan-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
};

export default function ProgressBar({
    value,
    max = 100,
    size = "md",
    variant = "gradient",
    label,
    showValue = false,
    animated = true,
    className,
}: ProgressBarProps) {
    const [mounted, setMounted] = useState(false);
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    useEffect(() => setMounted(true), []);

    return (
        <div className={cn("w-full", className)}>
            {(label || showValue) && (
                <div className="flex items-center justify-between mb-2">
                    {label && (
                        <span className="text-sm font-medium text-slate-300">
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span className="text-sm font-semibold text-white tabular-nums">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}

            <div
                className={cn(
                    "w-full overflow-hidden rounded-full bg-white/5 border border-white/5",
                    sizeStyles[size]
                )}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-label={label}
            >
                <motion.div
                    className={cn(
                        "h-full rounded-full relative",
                        variantStyles[variant]
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: mounted && animated ? `${percentage}%` : `${percentage}%` }}
                    transition={{
                        duration: animated ? 1 : 0,
                        ease: [0.33, 1, 0.68, 1],
                        delay: 0.2,
                    }}
                >
                    {/* Shimmer effect */}
                    {variant === "gradient" && size !== "sm" && (
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
