"use client";

/* -------------------------------------------------------------------------- */
/*                          BLOG STATS                                        */
/*                                                                            */
/*  Top row of stat cards for the blog page.                                 */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { FileText, Eye, PenLine, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogStatsData } from "@/app/actions/blog";

interface BlogStatsProps {
    stats: BlogStatsData;
}

const cards = [
    {
        key: "total" as const,
        label: "Total Posts",
        icon: <FileText className="h-5 w-5" />,
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        format: (s: BlogStatsData) => s.total.toString(),
    },
    {
        key: "published" as const,
        label: "Published",
        icon: <Eye className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (s: BlogStatsData) => s.published.toString(),
    },
    {
        key: "drafts" as const,
        label: "Drafts",
        icon: <PenLine className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (s: BlogStatsData) => s.drafts.toString(),
    },
    {
        key: "tags" as const,
        label: "Unique Tags",
        icon: <Tags className="h-5 w-5" />,
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        format: (s: BlogStatsData) => s.tags.length.toString(),
    },
];

export default function BlogStats({ stats }: BlogStatsProps) {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl",
                                card.bg,
                                card.text,
                            )}
                        >
                            {card.icon}
                        </div>
                    </div>

                    <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
                        {card.format(stats)}
                    </p>
                    <p className="mt-0.5 text-xs text-sx-text-muted">
                        {card.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
