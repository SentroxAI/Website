"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import { fadeUp, viewport } from "@/lib/animations";

import PortfolioCard from "./PortfolioCard";
import ProjectDetail from "./ProjectDetail";
import { portfolioProjects, categories, type PortfolioProject } from "./portfolioData";

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function PortfolioGrid() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProject, setSelectedProject] =
        useState<PortfolioProject | null>(null);

    const filteredProjects =
        activeCategory === "All"
            ? portfolioProjects
            : portfolioProjects.filter((p) => p.category === activeCategory);

    return (
        <Section id="portfolio-grid" spacing="md">
            <Container>
                {/* Filter Tabs */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="flex flex-wrap justify-center gap-2"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={[
                                "relative rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300",
                                activeCategory === cat
                                    ? "bg-blue-600 text-white"
                                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
                            ].join(" ")}
                        >
                            {cat}

                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="portfolio-filter"
                                    className="absolute inset-0 rounded-2xl bg-blue-600"
                                    style={{ zIndex: -1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}

                <motion.div
                    layout
                    className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <PortfolioCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Project Detail Modal */}

                <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            </Container>
        </Section>
    );
}
