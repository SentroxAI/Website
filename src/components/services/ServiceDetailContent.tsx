"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GlassCard from "@/components/ui/cards/GlassCard";
import GradientCard from "@/components/ui/cards/GradientCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import PageHeader from "@/components/ui/section/PageHeader";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";
import { servicesData } from "./servicesData";

type ServiceData = (typeof servicesData)[number];

/* -------------------------------------------------------------------------- */
/*                            COLOR MAPPING                                    */
/* -------------------------------------------------------------------------- */

const colorMap: Record<string, { icon: string; badge: string; glow: string; border: string }> = {
    blue: {
        icon: "bg-blue-500/15 text-blue-400",
        badge: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        glow: "from-blue-500/20 to-blue-600/5",
        border: "border-blue-500/20",
    },
    cyan: {
        icon: "bg-cyan-500/15 text-cyan-400",
        badge: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
        glow: "from-cyan-500/20 to-cyan-600/5",
        border: "border-cyan-500/20",
    },
    violet: {
        icon: "bg-violet-500/15 text-violet-400",
        badge: "border-violet-500/20 bg-violet-500/10 text-violet-300",
        glow: "from-violet-500/20 to-violet-600/5",
        border: "border-violet-500/20",
    },
    emerald: {
        icon: "bg-emerald-500/15 text-emerald-400",
        badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        glow: "from-emerald-500/20 to-emerald-600/5",
        border: "border-emerald-500/20",
    },
    amber: {
        icon: "bg-amber-500/15 text-amber-400",
        badge: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        glow: "from-amber-500/20 to-amber-600/5",
        border: "border-amber-500/20",
    },
    rose: {
        icon: "bg-rose-500/15 text-rose-400",
        badge: "border-rose-500/20 bg-rose-500/10 text-rose-300",
        glow: "from-rose-500/20 to-rose-600/5",
        border: "border-rose-500/20",
    },
};

/* -------------------------------------------------------------------------- */
/*                           FEATURES GRID                                     */
/* -------------------------------------------------------------------------- */

function FeaturesSection({ service }: { service: ServiceData }) {
    const colors = colorMap[service.color] || colorMap.blue;

    return (
        <Section id="features" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto max-w-3xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Key Features
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        What makes our {service.title.toLowerCase()} service stand out.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-16 grid gap-6 sm:grid-cols-2"
                >
                    {service.features.map((feature) => {
                        const FIcon = feature.icon;
                        return (
                            <motion.div key={feature.title} variants={fadeUp}>
                                <GlassCard className="group h-full p-8 transition-all duration-500 hover:-translate-y-1">
                                    <div className={`mb-5 inline-flex rounded-xl p-3 ${colors.icon}`}>
                                        <FIcon className="h-6 w-6" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-white">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                        {feature.description}
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

/* -------------------------------------------------------------------------- */
/*                         PROCESS SECTION                                     */
/* -------------------------------------------------------------------------- */

function ProcessSection({ service }: { service: ServiceData }) {
    return (
        <Section id="process" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto max-w-3xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Our Process
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        A proven methodology for delivering exceptional results.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto mt-16 max-w-2xl space-y-6"
                >
                    {service.process.map((step, index) => (
                        <motion.div
                            key={step}
                            variants={fadeUp}
                            className="flex items-center gap-5"
                        >
                            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-lg font-bold text-blue-400">
                                {index + 1}
                            </span>

                            <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
                                <span className="font-medium text-white">{step}</span>
                            </div>

                            {index < service.process.length - 1 && (
                                <div className="absolute left-6 top-12 h-6 w-px bg-blue-500/20" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </Section>
    );
}

/* -------------------------------------------------------------------------- */
/*                        TECH STACK SECTION                                    */
/* -------------------------------------------------------------------------- */

function TechStackSection({ service }: { service: ServiceData }) {
    const colors = colorMap[service.color] || colorMap.blue;

    return (
        <Section id="tech-stack" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto max-w-3xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Technology Stack
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Built with industry-leading technologies for reliability and performance.
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-3"
                >
                    {service.techStack.map((tech) => (
                        <span
                            key={tech}
                            className={`rounded-full border px-5 py-2.5 text-sm font-medium ${colors.badge}`}
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </Container>
        </Section>
    );
}

/* -------------------------------------------------------------------------- */
/*                           CTA SECTION                                       */
/* -------------------------------------------------------------------------- */

function ServiceDetailCTA({ service }: { service: ServiceData }) {
    return (
        <Section id="service-cta" spacing="lg">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <GradientCard
                        gradient="mixed"
                        radius="3xl"
                        hover={false}
                        className="relative overflow-hidden p-12 text-center lg:p-20"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.20),transparent_70%)]" />

                        <div className="relative">
                            <h2 className="mx-auto max-w-3xl text-3xl font-bold text-white md:text-4xl">
                                Ready to Get Started with {service.title}?
                            </h2>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                                Let&apos;s discuss your project and find the perfect solution.
                                Book a free consultation today.
                            </p>

                            <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
                                <PrimaryButton
                                    href="/contact"
                                    size="lg"
                                    rightIcon={<ArrowRight size={18} />}
                                >
                                    Start Your Project
                                </PrimaryButton>

                                <SecondaryButton href="/services" size="lg">
                                    View All Services
                                </SecondaryButton>
                            </div>
                        </div>
                    </GradientCard>
                </motion.div>
            </Container>
        </Section>
    );
}

/* -------------------------------------------------------------------------- */
/*                          MAIN DETAIL VIEW                                   */
/* -------------------------------------------------------------------------- */

export default function ServiceDetailContent({ serviceId }: { serviceId: string }) {
    const service = servicesData.find((s) => s.id === serviceId);

    if (!service) return null;

    const Icon = service.icon;

    return (
        <>
            <PageHeader
                badge={service.title}
                badgeIcon={<Icon className="h-4 w-4" />}
                title={service.title}
                description={service.description}
                breadcrumbs={[
                    { label: "Services", href: "/services" },
                    { label: service.title },
                ]}
                actions={
                    <>
                        <PrimaryButton
                            href="/contact"
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Get Started
                        </PrimaryButton>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            All Services
                        </Link>
                    </>
                }
            />

            {/* Description highlights */}
            <Section id="overview" spacing="sm">
                <Container>
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        className="mx-auto max-w-3xl"
                    >
                        <GlassCard className="p-8 lg:p-10">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-blue-400" />
                                <p className="text-lg leading-8 text-slate-300">
                                    {service.shortDescription} {service.description}
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                </Container>
            </Section>

            <FeaturesSection service={service} />
            <ProcessSection service={service} />
            <TechStackSection service={service} />
            <ServiceDetailCTA service={service} />
        </>
    );
}
