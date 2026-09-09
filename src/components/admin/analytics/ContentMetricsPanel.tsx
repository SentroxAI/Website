"use client";

/* -------------------------------------------------------------------------- */
/*                      CONTENT METRICS PANEL                                 */
/*                                                                            */
/*  Blog publishing analytics: post counts, avg words, top tags bar chart.   */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { FileText, Eye, PenLine, Tags, Type, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentMetrics } from "@/app/actions/analytics";

interface ContentMetricsPanelProps {
    metrics: ContentMetrics;
    className?: string;
}

export default function ContentMetricsPanel({ metrics, className }: ContentMetricsPanelProps) {
    const maxTagCount = Math.max(...metrics.topTags.map((t) => t.count), 1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn("space-y-5", className)}
        >
            {/* Mini stat row */}
            <div className="grid grid-cols-3 gap-3">
                <MiniStat
                    icon={<FileText className="h-4 w-4" />}
                    label="Total"
                    value={metrics.totalPosts.toString()}
                    color="text-orange-400 bg-orange-500/10"
                />
                <MiniStat
                    icon={<Eye className="h-4 w-4" />}
                    label="Published"
                    value={metrics.publishedPosts.toString()}
                    color="text-emerald-400 bg-emerald-500/10"
                />
                <MiniStat
                    icon={<PenLine className="h-4 w-4" />}
                    label="Drafts"
                    value={metrics.draftPosts.toString()}
                    color="text-amber-400 bg-amber-500/10"
                />
            </div>

            {/* Extra stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                        <Type className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white tabular-nums">
                            {metrics.avgWordsPerPost.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-sx-text-subtle">Avg Words/Post</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                        <Hash className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white tabular-nums">
                            {metrics.totalTags}
                        </p>
                        <p className="text-[9px] text-sx-text-subtle">Unique Tags</p>
                    </div>
                </div>
            </div>

            {/* Top tags bar chart */}
            {metrics.topTags.length > 0 && (
                <div>
                    <div className="flex items-center gap-1.5 mb-3">
                        <Tags className="h-3.5 w-3.5 text-sx-text-subtle" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                            Top Tags
                        </p>
                    </div>
                    <div className="space-y-2">
                        {metrics.topTags.map((tag, i) => {
                            const pct = (tag.count / maxTagCount) * 100;
                            return (
                                <motion.div
                                    key={tag.tag}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-xs text-sx-text-muted w-24 truncate">
                                        {tag.tag}
                                    </span>
                                    <div className="flex-1 h-5 rounded-md bg-white/[0.03] overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="h-full rounded-md bg-gradient-to-r from-orange-500/40 to-amber-500/40"
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-white tabular-nums w-6 text-right">
                                        {tag.count}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

/* ── Mini Stat ──────────────────────────────────────────────────────────────── */

function MiniStat({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg mb-1.5", color)}>
                {icon}
            </div>
            <p className="text-lg font-bold text-white tabular-nums">{value}</p>
            <p className="text-[9px] text-sx-text-subtle">{label}</p>
        </div>
    );
}
