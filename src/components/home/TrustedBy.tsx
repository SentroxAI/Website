"use client";

import { motion } from "framer-motion";
import {
    BrainCircuit,
    Cloud,
    Database,
    Globe,
    Layers3,
    Server,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const techStack = [
    "OpenAI",
    "Anthropic",
    "Google AI",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Stripe",
    "Cloudflare",
    "AWS",
    "Vercel",
];

const stats = [
    {
        value: "200+",
        label: "Projects Delivered",
        icon: Layers3,
    },
    {
        value: "98%",
        label: "SEO Performance",
        icon: Globe,
    },
    {
        value: "<3 Weeks",
        label: "Average Delivery",
        icon: Sparkles,
    },
    {
        value: "24/7",
        label: "AI Automation",
        icon: BrainCircuit,
    },
];

export default function TrustedBy() {
    return (
        <section className="relative overflow-hidden py-28">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_70%)]" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
                        Trusted Technology Stack
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        Powered by Modern AI & Cloud Infrastructure
                    </h2>

                    <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-400">
                        We build AI-powered digital experiences using enterprise-grade
                        technologies trusted by modern startups and growing businesses.
                    </p>
                </motion.div>

                {/* Tech Marquee */}
                <div className="relative mt-16 overflow-hidden">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 22,
                        }}
                        className="flex gap-5 whitespace-nowrap"
                    >
                        {[...techStack, ...techStack].map((tech, index) => (
                            <div
                                key={index}
                                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl"
                            >
                                <span className="font-medium text-slate-200">{tech}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: index * 0.12,
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                }}
                                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                            >
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
                                    <Icon className="h-7 w-7 text-blue-400" />
                                </div>

                                <h3 className="text-4xl font-bold text-white">
                                    {item.value}
                                </h3>

                                <p className="mt-3 text-slate-400">
                                    {item.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Features */}
                <div className="mt-20 grid gap-6 md:grid-cols-4">
                    {[
                        {
                            icon: Cloud,
                            title: "Cloud Native",
                        },
                        {
                            icon: Database,
                            title: "Scalable Database",
                        },
                        {
                            icon: Server,
                            title: "High Performance",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Enterprise Security",
                        },
                    ].map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                            >
                                <Icon className="h-6 w-6 text-cyan-400" />

                                <span className="font-medium text-slate-200">
                                    {feature.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}