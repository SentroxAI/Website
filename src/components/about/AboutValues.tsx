"use client";

import { motion } from "framer-motion";
import {
    Lightbulb,
    Heart,
    Zap,
    Shield,
    Users,
    Target,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import { fadeUp, hoverCard, staggerContainer, viewport } from "@/lib/animations";

const values = [
    {
        icon: Lightbulb,
        title: "Innovation First",
        description:
            "We stay at the cutting edge of AI and web technology, constantly exploring new ways to solve problems.",
        color: "text-amber-400 bg-amber-500/15",
    },
    {
        icon: Heart,
        title: "Client Obsessed",
        description:
            "Your success is our success. We treat every project as our own and go above and beyond to deliver results.",
        color: "text-rose-400 bg-rose-500/15",
    },
    {
        icon: Zap,
        title: "Speed & Quality",
        description:
            "We don't compromise. Fast delivery and premium quality go hand in hand in everything we build.",
        color: "text-blue-400 bg-blue-500/15",
    },
    {
        icon: Shield,
        title: "Trust & Transparency",
        description:
            "No hidden fees, no surprises. Clear communication, honest timelines, and transparent pricing.",
        color: "text-emerald-400 bg-emerald-500/15",
    },
    {
        icon: Users,
        title: "Collaboration",
        description:
            "We work with you, not just for you. Your expertise combined with ours creates the best outcomes.",
        color: "text-cyan-400 bg-cyan-500/15",
    },
    {
        icon: Target,
        title: "Results Driven",
        description:
            "Beautiful design is great, but measurable business impact is what matters. Every decision is data-informed.",
        color: "text-violet-400 bg-violet-500/15",
    },
];

export default function AboutValues() {
    return (
        <Section id="about-values" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        title="Our Core Values"
                        description="The principles that guide every project, decision, and interaction."
                    />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {values.map((value) => {
                        const Icon = value.icon;

                        return (
                            <motion.div
                                key={value.title}
                                variants={fadeUp}
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                            >
                                <GlassCard className="h-full p-8">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${value.color}`}
                                    >
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-white">
                                        {value.title}
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-400">
                                        {value.description}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </Section>
    );
}
