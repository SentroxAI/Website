"use client";

import Modal from "@/components/ui/overlays/Modal";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { ArrowRight } from "lucide-react";

import type { PortfolioProject } from "./portfolioData";

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

interface ProjectDetailProps {
    project: PortfolioProject | null;
    onClose: () => void;
}

export default function ProjectDetail({
    project,
    onClose,
}: ProjectDetailProps) {
    if (!project) return null;

    return (
        <Modal
            open={!!project}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            title={project.title}
            description={project.category}
            size="lg"
        >
            {/* Description */}

            <p className="leading-8 text-slate-400">
                {project.longDescription}
            </p>

            {/* Metrics */}

            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {project.metrics.map((metric) => (
                    <GlassCard key={metric.label} className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                            {metric.value}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            {metric.label}
                        </p>
                    </GlassCard>
                ))}
            </div>

            {/* Tech Stack */}

            <div className="mt-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Technologies Used
                </h4>

                <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-300"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* CTA */}

            <div className="mt-10 flex gap-4">
                <PrimaryButton
                    href="/contact"
                    rightIcon={<ArrowRight size={18} />}
                >
                    Start a Similar Project
                </PrimaryButton>
            </div>
        </Modal>
    );
}
