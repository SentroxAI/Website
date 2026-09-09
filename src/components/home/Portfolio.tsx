"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Globe,
    Rocket,
    Search,
    Zap,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

import { fadeUp, hoverCard, viewport } from "@/lib/animations";

import BrowserMockup from "./portfolio/BrowserMockup";
import ProjectGrid from "./portfolio/ProjectGrid";
import { projects } from "./portfolio/data";

const portfolioFeatures = [
    {
        icon: Globe,
        title: "Responsive Design",
    },
    {
        icon: Search,
        title: "SEO Optimized",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
    },
    {
        icon: Rocket,
        title: "Production Ready",
    },
];

export default function Portfolio() {
    const [selectedProject, setSelectedProject] = useState(
        projects.find((project) => project.featured) ?? projects[0]
    );
    const metrics = [
        {
            label: "Performance",
            value: selectedProject.metrics.performance,
        },
        {
            label: "SEO",
            value: selectedProject.metrics.seo,
        },
        {
            label: "Accessibility",
            value: selectedProject.metrics.accessibility,
        },
        {
            label: "Best Practices",
            value: selectedProject.metrics.bestPractices,
        },
    ];
    return (
        <Section
            id="portfolio"
            className="overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.08),transparent_70%)]" />

            <Container>
                {/* Heading */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="Featured Projects"
                        title="Solutions Built for Modern Businesses"
                        description="Explore some of the AI-powered digital experiences we build to help businesses automate operations, improve SEO and generate more leads."
                        className="mb-20"
                    />
                </motion.div>

                {/* Featured Card */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    whileHover={hoverCard.whileHover}
                    whileTap={hoverCard.whileTap}
                >
                    <GlassCard className="overflow-hidden p-0">
                        <div className="grid lg:grid-cols-2">
                            {/* LEFT */}

                            <div className="flex flex-col justify-between p-10">
                                <div>
                                    <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                                        {selectedProject.category}
                                    </span>

                                    <h3 className="mt-8 text-4xl font-bold text-white">
                                        {selectedProject.title}
                                    </h3>

                                    <p className="mt-6 leading-8 text-slate-400">
                                        {selectedProject.description}
                                    </p>

                                    {/* Tech */}

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        {selectedProject.technologies.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Button */}

                                <PrimaryButton
                                    href="/portfolio"
                                    className="mt-10"
                                    rightIcon={<ArrowRight size={20} />}
                                >
                                    View Case Study
                                </PrimaryButton>
                            </div>

                            {/* RIGHT */}

                            <div className="border-l border-white/10 p-10">
                                <BrowserMockup />

                                {/* Metrics */}

                                <div className="mt-8 grid grid-cols-2 gap-5">
                                    {metrics.map((metric) => (
                                        <motion.div
                                            key={metric.label}
                                            whileHover={hoverCard.whileHover}
                                            whileTap={hoverCard.whileTap}
                                        >
                                            <GlassCard className="h-full p-5">
                                                <p className="text-sm text-slate-400">
                                                    {metric.label}
                                                </p>

                                                <h4 className="mt-3 text-3xl font-bold text-white">
                                                    {metric.value}
                                                </h4>
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Bottom Feature Strip */}

                <div className="mt-12 grid gap-6 md:grid-cols-4">
                    {portfolioFeatures.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                            >
                                <GlassCard className="h-full p-6">
                                    <Icon className="mb-5 h-8 w-8 text-blue-400" />

                                    <h3 className="font-semibold text-white">
                                        {item.title}
                                    </h3>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-16">
                    <ProjectGrid
                        projects={projects}
                        selectedProject={selectedProject}
                        onSelect={setSelectedProject}
                    />
                </div>
            </Container>
        </Section>
    );
}