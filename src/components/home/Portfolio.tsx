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

import BrowserMockup from "./portfolio/BrowserMockup";
import ProjectGrid from "./portfolio/ProjectGrid";
import { projects } from "./portfolio/data";



export default function Portfolio() {
    const [selectedProject, setSelectedProject] = useState(
        projects.find((project) => project.featured) ?? projects[0]
    );
    return (
        <section className="relative overflow-hidden py-28">
            {/* Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,.08),transparent_70%)]" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
                        Featured Projects
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        Solutions Built for Modern Businesses
                    </h2>

                    <p className="mt-6 text-lg text-slate-400">
                        Explore some of the AI-powered digital experiences we build to
                        help businesses automate operations, improve SEO and generate
                        more leads.
                    </p>
                </motion.div>

                {/* Featured Card */}

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{
                        y: -8,
                    }}
                    className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    <div className="grid lg:grid-cols-2">
                        {/* LEFT */}

                        <div className="flex flex-col justify-between p-10">
                            <div>
                                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
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
                                            className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Button */}

                            <button className="mt-10 flex items-center gap-3 text-blue-400 transition-all duration-300 hover:gap-5">
                                View Case Study

                                <ArrowRight size={20} />
                            </button>
                        </div>

                        {/* RIGHT */}

                        <div className="border-l border-white/10 p-10">
                            <BrowserMockup />

                            {/* Metrics */}

                            <div className="mt-8 grid grid-cols-2 gap-5">
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                                >
                                    <p className="text-sm text-slate-400">Performance</p>
                                    <h4 className="mt-3 text-3xl font-bold text-white">
                                        {selectedProject.metrics.performance}
                                    </h4>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                                >
                                    <p className="text-sm text-slate-400">SEO</p>
                                    <h4 className="mt-3 text-3xl font-bold text-white">
                                        {selectedProject.metrics.seo}
                                    </h4>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                                >
                                    <p className="text-sm text-slate-400">Accessibility</p>
                                    <h4 className="mt-3 text-3xl font-bold text-white">
                                        {selectedProject.metrics.accessibility}
                                    </h4>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                                >
                                    <p className="text-sm text-slate-400">Best Practices</p>
                                    <h4 className="mt-3 text-3xl font-bold text-white">
                                        {selectedProject.metrics.bestPractices}
                                    </h4>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Feature Strip */}

                <div className="mt-12 grid gap-6 md:grid-cols-4">
                    {[
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
                    ].map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                whileHover={{
                                    y: -5,
                                }}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                            >
                                <Icon className="mb-5 h-8 w-8 text-blue-400" />

                                <h3 className="font-semibold text-white">
                                    {item.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>
                <ProjectGrid
                    projects={projects}
                    selectedProject={selectedProject}
                    onSelect={setSelectedProject}
                />
            </div>
        </section>
    );
}