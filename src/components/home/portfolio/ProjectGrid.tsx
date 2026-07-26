"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ProjectCard from "./ProjectCard";
import { Project } from "./types";

interface ProjectGridProps {
    projects: Project[];
    selectedProject: Project;
    onSelect: (project: Project) => void;
}

export default function ProjectGrid({
    projects,
    selectedProject,
    onSelect,
}: ProjectGridProps) {
    const categories = useMemo(
        () => [
            "All",
            ...new Set(projects.map((project) => project.category)),
        ],
        [projects]
    );

    const [activeCategory, setActiveCategory] = useState("All");

    const filteredProjects = useMemo(() => {
        if (activeCategory === "All") return projects;

        return projects.filter(
            (project) => project.category === activeCategory
        );
    }, [activeCategory, projects]);

    return (
        <div className="mt-20">
            {/* Section Header */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row"
            >
                <div>
                    <h3 className="text-3xl font-bold text-white">
                        More Projects
                    </h3>

                    <p className="mt-2 text-slate-400">
                        Browse different AI-powered digital experiences.
                    </p>
                </div>

                {/* Filters */}

                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${activeCategory === category
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/40 hover:bg-blue-500/10"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Grid */}

            <motion.div
                layout
                className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                            }}
                            transition={{
                                delay: index * 0.08,
                                duration: 0.35,
                            }}
                        >
                            <ProjectCard
                                project={project}
                                selected={selectedProject.id === project.id}
                                onSelect={onSelect}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}