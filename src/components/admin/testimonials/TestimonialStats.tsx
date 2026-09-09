"use client";

/* -------------------------------------------------------------------------- */
/*                     TESTIMONIAL STATS                                      */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { MessageSquareQuote, Star, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestimonialStatsData } from "@/app/actions/testimonials";

interface TestimonialStatsProps {
    stats: TestimonialStatsData;
}

const cards = [
    {
        key: "total" as const,
        label: "Total Reviews",
        icon: <MessageSquareQuote className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (s: TestimonialStatsData) => s.total.toString(),
    },
    {
        key: "featured" as const,
        label: "Featured",
        icon: <Award className="h-5 w-5" />,
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        format: (s: TestimonialStatsData) => s.featured.toString(),
    },
    {
        key: "avgRating" as const,
        label: "Avg Rating",
        icon: <TrendingUp className="h-5 w-5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        format: (s: TestimonialStatsData) => s.avgRating.toFixed(1),
    },
    {
        key: "fiveStar" as const,
        label: "5-Star Reviews",
        icon: <Star className="h-5 w-5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        format: (s: TestimonialStatsData) => s.fiveStarCount.toString(),
    },
];

export default function TestimonialStats({ stats }: TestimonialStatsProps) {
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
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", card.bg, card.text)}>
                            {card.icon}
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
                        {card.format(stats)}
                    </p>
                    <p className="mt-0.5 text-xs text-sx-text-muted">{card.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
