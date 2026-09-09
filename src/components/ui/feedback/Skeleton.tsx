"use client";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface SkeletonProps {
    shape?: "text" | "circle" | "card" | "custom";
    width?: string;
    height?: string;
    lines?: number;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Skeleton({
    shape = "text",
    width,
    height,
    lines = 1,
    className,
}: SkeletonProps) {
    const baseClasses =
        "animate-pulse rounded-xl bg-white/5 backdrop-blur-xl";

    /* ── Circle ─────────────────────────────────────────────────────────── */

    if (shape === "circle") {
        return (
            <div
                className={cn(baseClasses, "rounded-full", className)}
                style={{
                    width: width || "3rem",
                    height: height || width || "3rem",
                }}
            />
        );
    }

    /* ── Card ──────────────────────────────────────────────────────────── */

    if (shape === "card") {
        return (
            <div
                className={cn(
                    baseClasses,
                    "rounded-2xl border border-white/10 p-6",
                    className
                )}
                style={{ width, height: height || "12rem" }}
            >
                <div className="space-y-4">
                    <div className="h-4 w-2/3 rounded-lg bg-white/5" />
                    <div className="h-3 w-full rounded-lg bg-white/5" />
                    <div className="h-3 w-4/5 rounded-lg bg-white/5" />
                </div>
            </div>
        );
    }

    /* ── Custom ─────────────────────────────────────────────────────────── */

    if (shape === "custom") {
        return (
            <div
                className={cn(baseClasses, className)}
                style={{ width, height }}
            />
        );
    }

    /* ── Text (default) ─────────────────────────────────────────────────── */

    return (
        <div className={cn("space-y-3", className)} style={{ width }}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        baseClasses,
                        "h-4",
                        i === lines - 1 && lines > 1 && "w-3/4"
                    )}
                    style={{ height: height || undefined }}
                />
            ))}
        </div>
    );
}
