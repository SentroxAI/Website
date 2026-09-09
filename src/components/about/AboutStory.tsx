"use client";

import { motion } from "framer-motion";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                               TIMELINE DATA                                */
/* -------------------------------------------------------------------------- */

const timeline = [
    {
        year: "2023",
        title: "The Beginning",
        description:
            "Founded with a vision to make AI-powered web experiences accessible to businesses of all sizes.",
    },
    {
        year: "2024",
        title: "Rapid Growth",
        description:
            "Expanded services to include AI automation, chatbot development, and SEO. Crossed 50+ client milestone.",
    },
    {
        year: "2025",
        title: "Global Reach",
        description:
            "Serving clients across 12+ countries. Launched custom AI agent platform and enterprise solutions.",
    },
    {
        year: "2026",
        title: "Innovation Leader",
        description:
            "Pioneering next-gen AI integrations for web. 150+ projects delivered. Building the future of digital.",
    },
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function AboutStory() {
    return (
        <Section id="about-story" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        title="Our Story"
                        description="From a solo idea to a growing team — here's how Sentrox AI came to be."
                    />
                </motion.div>

                {/* Timeline */}

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="relative mt-16"
                >
                    {/* Center Line */}

                    <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-blue-500/50 via-cyan-400/30 to-transparent lg:left-1/2" />

                    <div className="space-y-12">
                        {timeline.map((event, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <motion.div
                                    key={event.year}
                                    variants={fadeUp}
                                    className={`relative flex items-center gap-8 ${
                                        isLeft
                                            ? "lg:flex-row"
                                            : "lg:flex-row-reverse"
                                    }`}
                                >
                                    {/* Timeline Dot */}

                                    <div className="absolute left-8 z-10 flex h-4 w-4 items-center justify-center lg:left-1/2 lg:-translate-x-1/2">
                                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 bg-slate-950" />
                                        <div className="absolute h-4 w-4 animate-ping rounded-full bg-blue-500/30" />
                                    </div>

                                    {/* Year Badge */}

                                    <div className="hidden lg:block lg:w-1/2">
                                        <div
                                            className={`${
                                                isLeft
                                                    ? "text-right pr-12"
                                                    : "text-left pl-12"
                                            }`}
                                        >
                                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-bold text-blue-400">
                                                {event.year}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Card */}

                                    <div className="ml-16 w-full lg:ml-0 lg:w-1/2">
                                        <div
                                            className={`${
                                                isLeft
                                                    ? "lg:pl-12"
                                                    : "lg:pr-12"
                                            }`}
                                        >
                                            <GlassCard className="p-6">
                                                <span className="mb-3 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 lg:hidden">
                                                    {event.year}
                                                </span>

                                                <h3 className="text-xl font-bold text-white">
                                                    {event.title}
                                                </h3>

                                                <p className="mt-3 leading-7 text-slate-400">
                                                    {event.description}
                                                </p>
                                            </GlassCard>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </Container>
        </Section>
    );
}
