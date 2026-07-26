"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Clock3,
    Headphones,
    Sparkles,
} from "lucide-react";

import PricingCard from "./pricing/PricingCard";
import PricingToggle from "./pricing/PricingToggle";
import CurrencySelector from "./pricing/CurrencySelector";
import { pricingPlans } from "./pricing/pricingData";
import { BillingCycle, Currency } from "./pricing/types";

export default function Pricing() {
    const [billing, setBilling] =
        useState<BillingCycle>("monthly");

    const [currency, setCurrency] =
        useState<Currency>("USD");

    return (
        <section
            id="pricing"
            className="relative overflow-hidden py-28"
        >
            {/* Background */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_60%)]" />

            <div className="absolute left-1/2 top-20 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
                        <Sparkles className="h-4 w-4" />

                        Flexible Pricing
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        Pricing That Scales
                        <br />
                        With Your Business
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-400">
                        Choose the plan that matches your business goals.
                        Whether you're launching your first website or
                        building an enterprise AI platform, we've got you
                        covered.
                    </p>
                </motion.div>

                {/* Controls */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
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
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mt-20 grid gap-6 md:grid-cols-3"
                >
                    {[
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
                    ].map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                whileHover={{
                                    y: -6,
                                }}
                                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                            >
                                <Icon className="mb-5 h-10 w-10 text-blue-400" />

                                <h3 className="text-xl font-semibold text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-3 leading-7 text-slate-400">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="relative mt-24 overflow-hidden rounded-[36px] border border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-slate-900/50 p-12 text-center backdrop-blur-2xl"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.25),transparent_70%)]" />

                    <div className="relative">
                        <h2 className="text-4xl font-bold text-white">
                            Not Sure Which Plan Fits?
                        </h2>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            Schedule a free consultation with our team.
                            We'll understand your business and recommend
                            the most suitable solution.
                        </p>

                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className="mt-10 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                            Book Free Consultation
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}