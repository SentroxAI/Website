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

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

import { fadeUp, hoverCard, viewport } from "@/lib/animations";

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
const featuredService = services.find((service) => service.featured);
const regularServices = services.filter((service) => !service.featured);
export default function Services() {
    return (
        <Section id="services">
            <Container>
                {/* Header */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="Our Services"
                        title="AI Solutions Designed for Modern Businesses"
                        description="From AI-powered websites to automation and digital growth, Sentrox builds solutions that help businesses scale faster."
                        className="mb-10 sm:mb-16"
                    />
                </motion.div>

                {/* Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Featured Card */}
                    <motion.div
                        whileHover={hoverCard.whileHover}
                        whileTap={hoverCard.whileTap}
                        className="lg:col-span-2"
                    >
                        <GlassCard className="group h-full p-5 sm:p-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15">
                                <Globe className="h-8 w-8 text-blue-400" />
                            </div>

                            <h3 className="mt-5 sm:mt-8 text-2xl sm:text-3xl font-bold text-white">
                                AI Website Development
                            </h3>

                            <p className="mt-4 max-w-xl text-slate-400">
                                Premium websites that combine beautiful design,
                                AI-powered experiences, fast performance and SEO
                                to convert visitors into customers.
                            </p>

                            <div className="mt-5 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
                                {["Next.js", "SEO", "AI", "Responsive", "Fast"].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <PrimaryButton
                                href="/services"
                                className="mt-10"
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Learn More
                            </PrimaryButton>
                        </GlassCard>
                    </motion.div>

                    {/* Side Cards */}
                    <div className="grid gap-6">
                        {services.slice(1, 4).map((service, index) => {
                            const Icon = service.icon;

                            return (
                                <motion.div
                                    key={service.title}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewport}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={hoverCard.whileHover}
                                    whileTap={hoverCard.whileTap}
                                >
                                    <GlassCard className="group h-full p-6">
                                        <Icon className="mb-4 h-8 w-8 text-cyan-400" />

                                        <h3 className="text-xl font-semibold text-white">
                                            {service.title}
                                        </h3>

                                        <p className="mt-3 text-sm text-slate-400">
                                            {service.description}
                                        </p>
                                    </GlassCard>
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
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                transition={{ delay: index * 0.1 }}
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                            >
                                <GlassCard className="h-full p-6">
                                    <Icon className="mb-4 h-8 w-8 text-blue-400" />

                                    <h3 className="text-xl font-semibold text-white">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        {service.description}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </Section>
    );
}