"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

import { fadeUp, hoverCard, viewport } from "@/lib/animations";

import FloatingMetric from "./outcomes/FloatingMetric";
import MetricBadge from "./outcomes/MetricBadge";
import OutcomeCard from "./outcomes/OutcomeCard";
import {
    floatingMetrics,
    metrics,
    outcomes,
} from "./outcomes/outcomeData";

export default function Outcomes() {
    return (
        <Section
            id="outcomes"
            className="overflow-hidden"
        >
            {/* Background */}

            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.08),transparent_60%)]" />

            <div className="absolute left-1/2 top-0 -z-10 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

            <div className="absolute right-0 top-40 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

            <Container>

                {/* Header */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="What Businesses Can Expect"
                        badgeIcon={<Sparkles className="h-4 w-4" />}
                        title="Websites Built To Deliver Results"
                        description="Every project is designed with performance, SEO, AI automation, security, scalability, and conversion in mind—helping businesses build a stronger online presence."
                        className="mb-20"
                    />
                </motion.div>

                {/* Floating Metrics */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="relative mt-20 hidden h-40 lg:block"
                >

                    <div className="absolute left-0 top-8">
                        <FloatingMetric
                            title={floatingMetrics[0].title}
                            subtitle={floatingMetrics[0].subtitle}
                        />
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <FloatingMetric
                            title={floatingMetrics[1].title}
                            subtitle={floatingMetrics[1].subtitle}
                            delay={0.4}
                        />
                    </div>

                    <div className="absolute right-0 top-8">
                        <FloatingMetric
                            title={floatingMetrics[2].title}
                            subtitle={floatingMetrics[2].subtitle}
                            delay={0.8}
                        />
                    </div>
                </motion.div>
                {/* Outcome Cards */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3"
                >

                    {outcomes.map((outcome, index) => (

                        <OutcomeCard
                            key={outcome.id}
                            outcome={outcome}
                            index={index}
                        />

                    ))}

                </motion.div>

                {/* Metrics */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-28 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                >

                    {metrics.map((metric, index) => (

                        <MetricBadge
                            key={metric.id}
                            metric={metric}
                            index={index}
                        />

                    ))}

                </motion.div>

                {/* CTA */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-32"
                >
                    <GlassCard className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10 p-12 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10" />

                        <div className="relative text-center">

                            <h2 className="mx-auto max-w-3xl text-4xl font-bold text-white md:text-5xl">
                                Ready To Grow Your Business?
                            </h2>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                                Whether you're launching a startup,
                                redesigning an existing website,
                                or adding AI-powered automation,
                                Sentrox AI builds modern digital
                                experiences focused on performance,
                                scalability, and long-term growth.
                            </p>

                            <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">

                                <PrimaryButton
                                    href="/contact"
                                    size="lg"
                                    rightIcon={<ArrowRight size={18} />}
                                >
                                    Start Your Project
                                </PrimaryButton>

                                <SecondaryButton
                                    href="/portfolio"
                                    size="lg"
                                >
                                    View Portfolio
                                </SecondaryButton>

                            </div>

                        </div>
                    </GlassCard>
                </motion.div>

            </Container>
        </Section>
    );
}