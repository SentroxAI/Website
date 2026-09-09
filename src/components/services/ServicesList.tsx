"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GlassCard from "@/components/ui/cards/GlassCard";
import GradientBadge from "@/components/ui/badges/GradientBadge";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { fadeUp, hoverCard, staggerContainer, viewport } from "@/lib/animations";

import { servicesData } from "./servicesData";

/* -------------------------------------------------------------------------- */
/*                            COLOR MAPPING                                   */
/* -------------------------------------------------------------------------- */

const colorMap: Record<string, { icon: string; badge: string; glow: string }> = {
    blue: {
        icon: "bg-blue-500/15 text-blue-400",
        badge: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        glow: "group-hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]",
    },
    cyan: {
        icon: "bg-cyan-500/15 text-cyan-400",
        badge: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
        glow: "group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    },
    violet: {
        icon: "bg-violet-500/15 text-violet-400",
        badge: "border-violet-500/20 bg-violet-500/10 text-violet-300",
        glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    },
    emerald: {
        icon: "bg-emerald-500/15 text-emerald-400",
        badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    },
    amber: {
        icon: "bg-amber-500/15 text-amber-400",
        badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    },
    rose: {
        icon: "bg-rose-500/15 text-rose-400",
        badge: "border-rose-500/20 bg-rose-500/10 text-rose-300",
        glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]",
    },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function ServicesList() {
    return (
        <Section id="services-list" spacing="md">
            <Container>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="space-y-12"
                >
                    {servicesData.map((service, index) => {
                        const Icon = service.icon;
                        const colors = colorMap[service.color] || colorMap.blue;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={service.id}
                                variants={fadeUp}
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                            >
                                <GlassCard className="group overflow-hidden p-0 transition-shadow duration-500">
                                    <div
                                        className={`grid gap-0 lg:grid-cols-2 ${
                                            isEven ? "" : "lg:[direction:rtl]"
                                        }`}
                                    >
                                        {/* Content Side */}

                                        <div className="p-8 lg:p-12 lg:[direction:ltr]">
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.icon}`}
                                            >
                                                <Icon className="h-7 w-7" />
                                            </div>

                                            <h3 className="mt-6 text-3xl font-bold text-white">
                                                {service.title}
                                            </h3>

                                            <p className="mt-4 leading-8 text-slate-400">
                                                {service.description}
                                            </p>

                                            {/* Features */}

                                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                                {service.features.map((feature) => {
                                                    const FIcon = feature.icon;

                                                    return (
                                                        <div
                                                            key={feature.title}
                                                            className="flex items-start gap-3"
                                                        >
                                                            <FIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />

                                                            <div>
                                                                <h4 className="text-sm font-semibold text-white">
                                                                    {feature.title}
                                                                </h4>
                                                                <p className="mt-0.5 text-xs text-slate-500">
                                                                    {feature.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <PrimaryButton
                                                href="/contact"
                                                className="mt-8"
                                                rightIcon={<ArrowRight size={18} />}
                                            >
                                                Get Started
                                            </PrimaryButton>
                                        </div>

                                        {/* Side Panel */}

                                        <div className="border-t border-white/10 bg-white/[0.02] p-8 lg:border-l lg:border-t-0 lg:p-12 lg:[direction:ltr]">
                                            {/* Process */}

                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                                Process
                                            </h4>

                                            <ol className="mt-4 space-y-3">
                                                {service.process.map((step, i) => (
                                                    <li
                                                        key={step}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-bold text-blue-400">
                                                            {i + 1}
                                                        </span>

                                                        <span className="text-sm text-slate-300">
                                                            {step}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ol>

                                            {/* Tech Stack */}

                                            <h4 className="mt-8 text-sm font-semibold uppercase tracking-wider text-slate-500">
                                                Tech Stack
                                            </h4>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {service.techStack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className={`rounded-full border px-3 py-1 text-xs font-medium ${colors.badge}`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </Section>
    );
}
