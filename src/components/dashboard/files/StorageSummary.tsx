"use client";

/* -------------------------------------------------------------------------- */
/*                          STORAGE SUMMARY                                   */
/*                                                                            */
/*  Top bar showing total storage used, file count, and type breakdown.       */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { HardDrive, FileText, Image, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { files, formatFileSize, getTotalSize } from "./data";

export default function StorageSummary() {
    const totalSize = getTotalSize();
    const fileCount = files.length;
    const storageLimit = 25 * 1024 * 1024 * 1024; // 25 GB
    const percentage = Math.round((totalSize / storageLimit) * 100);

    // Type breakdown
    const breakdown = [
        { label: "Documents", types: ["pdf", "document"], icon: <FileText className="h-3 w-3" />, color: "bg-blue-500" },
        { label: "Images", types: ["image", "figma"], icon: <Image className="h-3 w-3" />, color: "bg-emerald-500" },
        { label: "Media", types: ["video", "audio"], icon: <Film className="h-3 w-3" />, color: "bg-violet-500" },
    ].map((cat) => {
        const size = files
            .filter((f) => cat.types.includes(f.type))
            .reduce((sum, f) => sum + f.size, 0);
        return { ...cat, size };
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: storage info */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                        <HardDrive className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">
                            {formatFileSize(totalSize)}
                            <span className="text-xs font-normal text-sx-text-muted ml-1">
                                / 25 GB used
                            </span>
                        </p>
                        <p className="text-[11px] text-sx-text-muted">
                            {fileCount} files · {percentage}% of storage
                        </p>
                    </div>
                </div>

                {/* Right: breakdown chips */}
                <div className="flex items-center gap-3">
                    {breakdown.map((cat) => (
                        <div key={cat.label} className="flex items-center gap-1.5 text-[11px] text-sx-text-muted">
                            <span className={cn("h-2 w-2 rounded-full", cat.color)} />
                            <span>{cat.label}</span>
                            <span className="font-medium text-sx-text-secondary tabular-nums">
                                {formatFileSize(cat.size)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                />
            </div>
        </motion.div>
    );
}
