"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Bot,
    Globe,
    LayoutTemplate,
    Search,
    Settings2,
    Wrench,
} from "lucide-react";

const services = [
    {
        title: "AI Website Development",
        description:
            "Premium websites powered by AI, optimized for conversions, performance, SEO and scalability.",
        icon: Globe,
        featured: true,
        features: [
            "Next.js",
            "Responsive",
            "SEO",
            "Analytics",
        ],
    },
    {
        title: "AI Chatbots",
        description:
            "Intelligent assistants that automate customer support and lead generation.",
        icon: Bot,
    },
    {
        title: "SEO Optimization",
        description:
            "Technical SEO, on-page optimization and Core Web Vitals improvements.",
        icon: Search,
    },
    {
        title: "AI Automation",
        description:
            "Automate repetitive business workflows using modern AI tools.",
        icon: Settings2,
    },
    {
        title: "Landing Pages",
        description:
            "High-converting landing pages built for marketing campaigns.",
        icon: LayoutTemplate,
    },
    {
        title: "Maintenance",
        description:
            "Continuous updates, monitoring and security improvements.",
        icon: Wrench,
    },
];

export default function Services() {
    return (
        <section className="relative py-28">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
                        Our Services
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        AI Solutions Designed for Modern Businesses
                    </h2>

                    <p className="mt-6 text-lg text-slate-400">
                        From AI-powered websites to automation and digital growth,
                        Sentrox builds solutions that help businesses scale faster.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Featured Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-2"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15">
                            <Globe className="h-8 w-8 text-blue-400" />
                        </div>

                        <h3 className="mt-8 text-3xl font-bold text-white">
                            AI Website Development
                        </h3>

                        <p className="mt-4 max-w-xl text-slate-400">
                            Premium websites that combine beautiful design, AI-powered
                            experiences, fast performance and SEO to convert visitors
                            into customers.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {["Next.js", "SEO", "AI", "Responsive", "Fast"].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <button className="mt-10 flex items-center gap-2 text-blue-400 transition group-hover:gap-3">
                            Learn More
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>

                    {/* Side Cards */}
                    <div className="grid gap-6">
                        {services.slice(1, 4).map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -6 }}
                                    className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                                >
                                    <Icon className="mb-4 h-8 w-8 text-cyan-400" />

                                    <h3 className="text-xl font-semibold text-white">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Cards */}
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.slice(4).map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.03 }}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                            >
                                <Icon className="mb-4 h-8 w-8 text-blue-400" />

                                <h3 className="text-xl font-semibold text-white">
                                    {service.title}
                                </h3>

                                <p className="mt-3 text-sm text-slate-400">
                                    {service.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}