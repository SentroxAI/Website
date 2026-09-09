"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import GlassCard from "@/components/ui/cards/GlassCard";
import GradientBadge from "@/components/ui/badges/GradientBadge";

import type { PortfolioProject } from "./portfolioData";

/* -------------------------------------------------------------------------- */
/*                            COLOR MAPPING                                   */
/* -------------------------------------------------------------------------- */

const colorMap: Record<string, string> = {
    blue: "from-blue-600/20 to-blue-400/5",
    emerald: "from-emerald-600/20 to-emerald-400/5",
    cyan: "from-cyan-600/20 to-cyan-400/5",
    violet: "from-violet-600/20 to-violet-400/5",
    amber: "from-amber-600/20 to-amber-400/5",
    rose: "from-rose-600/20 to-rose-400/5",
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

interface PortfolioCardProps {
    project: PortfolioProject;
    onClick: () => void;
}

export default function PortfolioCard({
    project,
    onClick,
}: PortfolioCardProps) {
    const gradient = colorMap[project.color] || colorMap.blue;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <GlassCard
                className="group h-full cursor-pointer overflow-hidden p-0 transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.12)]"
                onClick={onClick}
            >
                {/* Image Placeholder */}

                <div
                    className={`relative flex h-52 items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                    {/* Grid overlay */}

                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />

                    <h3 className="relative text-2xl font-bold text-white/80">
                        {project.title
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                    </h3>

                    {/* Hover arrow */}

                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-xl transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5 text-white" />
                    </div>

                    {/* Featured badge */}

                    {project.featured && (
                        <div className="absolute left-4 top-4">
                            <GradientBadge variant="primary">
                                Featured
                            </GradientBadge>
                        </div>
                    )}
                </div>

                {/* Content */}

                <div className="p-6">
                    <div className="mb-3">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400">
                            {project.category}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
                        {project.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        {project.description}
                    </p>

                    {/* Tech Stack */}

                    <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-500"
                            >
                                {tech}
                            </span>
                        ))}

                        {project.tech.length > 4 && (
                            <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                +{project.tech.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
