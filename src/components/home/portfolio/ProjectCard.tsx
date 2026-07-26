"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Project } from "./types";

interface ProjectCardProps {
    project: Project;
    selected: boolean;
    onSelect: (project: Project) => void;
}

export default function ProjectCard({
    project,
    selected,
    onSelect,
}: ProjectCardProps) {
    return (
        <motion.div
            layout
            whileHover={{
                y: -10,
                rotateX: 4,
                rotateY: -4,
                scale: 1.02,
            }}
            transition={{
                duration: 0.35,
            }}
            style={{
                transformStyle: "preserve-3d",
            }}
            onClick={() => onSelect(project)}
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 ${selected
                    ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_40px_rgba(37,99,235,.25)]"
                    : "border-white/10 bg-white/5 hover:border-blue-400/30"
                }`}
        >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 transition duration-500 group-hover:opacity-100" />

            {/* Content */}
            <div className="relative p-7">
                {/* Top */}
                <div className="flex items-center justify-between">
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {project.category}
                    </span>

                    {selected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="rounded-full bg-blue-500/20 p-2"
                        >
                            <Sparkles className="h-4 w-4 text-blue-400" />
                        </motion.div>
                    )}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-2xl font-bold text-white">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-sm leading-7 text-slate-400">
                    {project.description}
                </p>

                {/* Technologies */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Divider */}
                <div className="my-7 h-px bg-white/10" />

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                    <Metric
                        label="Performance"
                        value={project.metrics.performance}
                    />

                    <Metric
                        label="SEO"
                        value={project.metrics.seo}
                    />

                    <Metric
                        label="Accessibility"
                        value={project.metrics.accessibility}
                    />

                    <Metric
                        label="Best"
                        value={project.metrics.bestPractices}
                    />
                </div>

                {/* CTA */}
                <motion.div
                    whileHover={{
                        x: 5,
                    }}
                    className="mt-8 flex items-center justify-between"
                >
                    <div className="flex items-center gap-2 text-blue-400">
                        <CheckCircle2 size={18} />

                        <span className="text-sm font-medium">
                            View Project
                        </span>
                    </div>

                    <ArrowRight className="text-blue-400 transition-transform duration-300 group-hover:translate-x-2" />
                </motion.div>
            </div>

            {/* Animated Border */}
            {selected && (
                <motion.div
                    layoutId="portfolio-border"
                    className="absolute inset-0 rounded-3xl border-2 border-blue-400 pointer-events-none"
                />
            )}
        </motion.div>
    );
}

interface MetricProps {
    label: string;
    value: number;
}

function Metric({ label, value }: MetricProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">
                {label}
            </p>

            <h4 className="mt-2 text-xl font-bold text-white">
                {value}
            </h4>
        </div>
    );
}