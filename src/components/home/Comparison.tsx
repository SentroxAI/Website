"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2,
    XCircle,
    Sparkles,
} from "lucide-react";

const traditional = [
    "Weeks of meetings",
    "Slow project delivery",
    "Generic website templates",
    "Manual workflows",
    "Limited scalability",
    "Basic SEO",
    "Little automation",
];

const sentrox = [
    "AI-powered discovery",
    "Rapid development",
    "Premium custom UI/UX",
    "Business automation",
    "Scalable architecture",
    "Advanced SEO optimization",
    "24/7 AI assistance",
];

export default function Comparison() {
    return (
        <section className="relative overflow-hidden py-28">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.08),transparent_70%)]" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-20 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
                        Why Choose Sentrox
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        Traditional Agency vs AI-First Development
                    </h2>

                    <p className="mt-6 text-lg text-slate-400">
                        We combine modern engineering, AI automation, and premium
                        design to deliver faster results with higher quality.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Traditional */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-xl"
                    >
                        <h3 className="mb-8 text-2xl font-bold text-white">
                            Traditional Agency
                        </h3>

                        <div className="space-y-5">
                            {traditional.map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4"
                                >
                                    <XCircle className="h-6 w-6 text-red-400" />

                                    <span className="text-slate-300">
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sentrox */}
                    <motion.div
                        whileHover={{ y: -6 }}
                        className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 backdrop-blur-xl"
                    >
                        <div className="mb-8 flex items-center gap-3">
                            <Sparkles className="text-blue-400" />

                            <h3 className="text-2xl font-bold text-white">
                                Sentrox AI
                            </h3>
                        </div>

                        <div className="space-y-5">
                            {sentrox.map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4"
                                >
                                    <CheckCircle2 className="h-6 w-6 text-green-400" />

                                    <span className="text-slate-200">
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 p-10 text-center"
                >
                    <h3 className="text-3xl font-bold text-white">
                        Build Smarter. Launch Faster.
                    </h3>

                    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                        Modern businesses need more than just a website—they need an
                        intelligent digital platform that drives growth.
                    </p>

                    <button className="mt-8 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500">
                        Start Your Project
                    </button>
                </motion.div>
            </div>
        </section>
    );
}