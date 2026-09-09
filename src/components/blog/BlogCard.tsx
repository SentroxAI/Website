"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Bot, Globe, Zap, Search, Cpu, Shield, type LucideIcon } from "lucide-react";

import GlassCard from "@/components/ui/cards/GlassCard";
import { hoverCard } from "@/lib/animations";

import type { BlogPost } from "./blogData";

/* -------------------------------------------------------------------------- */
/*                               ICON MAP                                     */
/* -------------------------------------------------------------------------- */

const iconMap: Record<string, LucideIcon> = {
    Bot,
    Globe,
    Zap,
    Search,
    Cpu,
    Shield,
};

/* -------------------------------------------------------------------------- */
/*                              COLOR MAPPING                                 */
/* -------------------------------------------------------------------------- */

const colorMap: Record<string, { icon: string; tag: string }> = {
    blue: {
        icon: "bg-blue-500/15 text-blue-400",
        tag: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    },
    cyan: {
        icon: "bg-cyan-500/15 text-cyan-400",
        tag: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    amber: {
        icon: "bg-amber-500/15 text-amber-400",
        tag: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    },
    emerald: {
        icon: "bg-emerald-500/15 text-emerald-400",
        tag: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
    violet: {
        icon: "bg-violet-500/15 text-violet-400",
        tag: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    },
    rose: {
        icon: "bg-rose-500/15 text-rose-400",
        tag: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    const Icon = iconMap[post.icon] || Bot;
    const colors = colorMap[post.color] || colorMap.blue;

    const formattedDate = new Date(post.publishedAt).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
    );

    return (
        <motion.div
            whileHover={hoverCard.whileHover}
            whileTap={hoverCard.whileTap}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
        >
            <Link href={`/blog/${post.slug}`}>
                <GlassCard className="group h-full p-0 transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.10)]">
                    {/* Top Section */}

                    <div className="p-6 pb-0">
                        <div className="flex items-center justify-between">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.icon}`}
                            >
                                <Icon className="h-6 w-6" />
                            </div>

                            {post.featured && (
                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* Category */}

                        <span
                            className={`mt-5 inline-block rounded-full border px-3 py-1 text-xs font-medium ${colors.tag}`}
                        >
                            {post.category}
                        </span>

                        {/* Title */}

                        <h3 className="mt-4 text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                            {post.title}
                        </h3>

                        {/* Excerpt */}

                        <p className="mt-3 text-sm leading-7 text-slate-400">
                            {post.excerpt}
                        </p>
                    </div>

                    {/* Bottom Section */}

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 px-6 py-4">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {formattedDate}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {post.readTime}
                            </span>
                        </div>

                        <span className="flex items-center gap-1 text-xs font-medium text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                            Read
                            <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </GlassCard>
            </Link>
        </motion.div>
    );
}
