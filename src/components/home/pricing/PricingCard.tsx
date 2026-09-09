"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import FeatureItem from "./FeatureItem";
import { BillingCycle, Currency, PricingPlan } from "./types";

interface PricingCardProps {
    plan: PricingPlan;
    currency: Currency;
    billing: BillingCycle;
}

export default function PricingCard({
    plan,
    currency,
    billing,
}: PricingCardProps) {
    const price = plan.prices[currency][billing];

    return (
        <motion.div
            whileHover={{
                y: -10,
                scale: 1.02,
            }}
            transition={{
                type: "spring",
                stiffness: 250,
            }}
            className={`relative overflow-hidden rounded-3xl border backdrop-blur-2xl ${plan.popular
                    ? "border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-white/5"
                    : "border-white/10 bg-white/5"
                }`}
        >
            {/* Popular Ribbon */}

            {plan.popular && (
                <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    Most Popular
                </div>
            )}

            {/* Glow */}

            {plan.popular && (
                <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
            )}

            <div className="relative p-8">
                <h3 className="text-2xl font-bold text-white">
                    {plan.name}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                    {plan.description}
                </p>

                <motion.div
                    key={`${currency}-${billing}`}
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mt-8"
                >
                    <span className="text-5xl font-black tracking-tight text-white">
                        {price}
                    </span>

                    {price !== "Custom" && (
                        <span className="ml-2 text-slate-400">
                            / {billing === "monthly" ? "month" : "year"}
                        </span>
                    )}
                </motion.div>

                <motion.a
                    href={plan.href || "/contact"}
                    whileHover={{
                        scale: 1.02,
                    }}
                    whileTap={{
                        scale: 0.98,
                    }}
                    className={`mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-semibold transition-all ${plan.popular
                            ? "bg-blue-600 text-white hover:bg-blue-500"
                            : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                >
                    {plan.buttonText}

                    <ArrowRight size={18} />
                </motion.a>

                <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                        <FeatureItem
                            key={feature}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}