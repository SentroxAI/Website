"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Clock3,
    Headphones,
    Sparkles,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

import { fadeUp, hoverCard, viewport } from "@/lib/animations";
import { ArrowRight } from "lucide-react";
import PricingCard from "./pricing/PricingCard";
import PricingToggle from "./pricing/PricingToggle";
import CurrencySelector from "./pricing/CurrencySelector";
import { pricingPlans } from "./pricing/pricingData";
import { BillingCycle, Currency } from "./pricing/types";

const trustItems = [
    {
        icon: ShieldCheck,
        title: "No Hidden Charges",
        description:
            "Transparent pricing with no surprise costs.",
    },
    {
        icon: Clock3,
        title: "Fast Delivery",
        description:
            "Projects delivered on schedule without compromising quality.",
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description:
            "We're here whenever you need technical assistance.",
    },
];

export default function Pricing() {
    const [billing, setBilling] =
        useState<BillingCycle>("monthly");

    const [currency, setCurrency] =
        useState<Currency>("USD");

    return (
        <Section
            id="pricing"
            className="overflow-hidden"
        >
            {/* Background */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_60%)]" />

            <div className="absolute left-1/2 top-20 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

            <Container>
                {/* Heading */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="Flexible Pricing"
                        badgeIcon={<Sparkles className="h-4 w-4" />}
                        title="Pricing That Scales With Your Business"
                        description="Choose the plan that matches your business goals. Whether you're launching your first website or building an enterprise AI platform, we've got you covered."
                    />
                </motion.div>

                {/* Controls */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-14 flex flex-col items-center justify-center gap-6 lg:flex-row"
                >
                    <PricingToggle
                        value={billing}
                        onChange={setBilling}
                    />

                    <CurrencySelector
                        value={currency}
                        onChange={setCurrency}
                    />
                </motion.div>

                {/* Cards */}

                <motion.div
                    layout
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-20 grid gap-8 lg:grid-cols-3"
                >
                    {pricingPlans.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            billing={billing}
                            currency={currency}
                        />
                    ))}
                </motion.div>

                {/* Trust Section */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-20 grid gap-6 md:grid-cols-3"
                >
                    {trustItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                            >
                                <GlassCard className="h-full p-8">
                                    <Icon className="mb-5 h-10 w-10 text-blue-400" />

                                    <h3 className="text-xl font-semibold text-white">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-400">
                                        {item.description}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-24"
                >
                    <GlassCard className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-slate-900/50 p-12 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.25),transparent_70%)]" />

                        <div className="relative">
                            <h2 className="mx-auto max-w-3xl text-4xl font-bold text-white md:text-5xl">
                                Not Sure Which Plan Fits?
                            </h2>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                                Schedule a free consultation with our team.
                                We'll understand your business and recommend
                                the most suitable solution.
                            </p>

                            <PrimaryButton
                                href="/contact"
                                size="lg"
                                className="mt-10"
                                rightIcon={<ArrowRight size={18} />}
                            >
                                Book Free Consultation
                            </PrimaryButton>
                        </div>
                    </GlassCard>
                </motion.div>
            </Container>
        </Section>
    );
}