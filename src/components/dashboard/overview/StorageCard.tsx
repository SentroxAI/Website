"use client";

/* -------------------------------------------------------------------------- */
/*                          STORAGE CARD                                      */
/*                                                                            */
/*  Storage usage card with animated progress bar and breakdown segments.     */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { storageData } from "./data";

export default function StorageCard() {
    const { used, total, breakdown } = storageData;
    const percentage = Math.round((used / total) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32, ease: "easeOut" }}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-5",
                "border border-white/[0.06] bg-white/[0.02]",
                "transition-all duration-300",
                "hover:border-white/[0.12] hover:bg-white/[0.04]",
                "hover:shadow-lg hover:-translate-y-0.5 hover:shadow-orange-500/10"
            )}
        >
            {/* Gradient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                            <HardDrive className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-sx-text-muted">
                                Storage Used
                            </p>
                            <p className="text-lg font-bold text-white tabular-nums">
                                {used} GB
                                <span className="text-xs font-normal text-sx-text-subtle ml-1">
                                    / {total} GB
                                </span>
                            </p>
                        </div>
                    </div>
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            percentage > 80
                                ? "bg-red-500/15 text-red-400"
                                : percentage > 60
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-emerald-500/15 text-emerald-400"
                        )}
                    >
                        {percentage}%
                    </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                            duration: 1.2,
                            delay: 0.5,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className={cn(
                            "h-full rounded-full",
                            percentage > 80
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : "bg-gradient-to-r from-orange-500 to-amber-400"
                        )}
                    />
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-2">
                    {breakdown.map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-2 text-xs"
                        >
                            <span
                                className={cn(
                                    "h-2 w-2 rounded-full",
                                    item.color
                                )}
                            />
                            <span className="text-sx-text-muted">
                                {item.label}
                            </span>
                            <span className="ml-auto font-medium text-sx-text-secondary tabular-nums">
                                {item.size} GB
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
