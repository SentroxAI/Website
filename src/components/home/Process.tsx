"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    BrainCircuit,
    Lightbulb,
    Palette,
    Code2,
    Rocket,
    TrendingUp,
} from "lucide-react";

const steps = [
    {
        title: "Discover",
        icon: Lightbulb,
        description:
            "Understanding your business goals, audience and requirements.",
    },
    {
        title: "Strategy",
        icon: BrainCircuit,
        description:
            "Planning the best AI solutions, website architecture and automation.",
    },
    {
        title: "Design",
        icon: Palette,
        description:
            "Creating premium UI/UX focused on user experience and conversions.",
    },
    {
        title: "Develop",
        icon: Code2,
        description:
            "Building scalable websites with AI integrations and modern technologies.",
    },
    {
        title: "Launch",
        icon: Rocket,
        description:
            "Deployment, optimization and quality assurance for production.",
    },
    {
        title: "Growth",
        icon: TrendingUp,
        description:
            "Continuous improvements, analytics, SEO and long-term support.",
    },
];

export default function Process() {
    return (
        <section className="relative py-28 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)]" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
                        Our Process
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        From Idea to AI-Powered Growth
                    </h2>

                    <p className="mt-6 text-lg text-slate-400">
                        Every project follows a structured workflow to ensure quality,
                        performance and measurable business results.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-0 right-0 top-12 hidden h-[2px] bg-gradient-to-r from-blue-500/40 via-cyan-400/60 to-blue-500/40 lg:block" />

                    <div className="grid gap-8 lg:grid-cols-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{
                                        y: -10,
                                    }}
                                    className="relative text-center"
                                >
                                    {/* Icon */}
                                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                                        <Icon className="h-10 w-10 text-blue-400" />
                                    </div>

                                    {/* Arrow */}
                                    {index !== steps.length - 1 && (
                                        <ArrowRight className="absolute -right-6 top-11 hidden text-blue-400 lg:block" />
                                    )}

                                    {/* Card */}
                                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                                        <h3 className="text-xl font-semibold text-white">
                                            {step.title}
                                        </h3>

                                        <p className="mt-4 text-sm leading-7 text-slate-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}