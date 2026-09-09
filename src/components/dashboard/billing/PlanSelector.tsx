"use client";

/* -------------------------------------------------------------------------- */
/*                        PLAN SELECTOR (CLIENT)                              */
/*                                                                            */
/*  Sprint 4 — Module 1: Plan comparison and upgrade flow with Razorpay.     */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Check,
    Crown,
    Zap,
    ArrowRight,
    IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlans } from "@/app/actions/billing";
import type { SubscriptionPlan, BillingCycle } from "@/types/billing";
import UpiCheckout from "./UpiCheckout";

export default function PlanSelector() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);

    const loadPlans = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getPlans();
            setPlans(data);
        } catch (error) {
            console.error("Failed to load plans:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlans();
    }, [loadPlans]);

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        if (plan.price_monthly === 0) {
            // Enterprise — contact sales
            window.location.href = "/contact";
            return;
        }
        setSelectedPlan(plan);
        setShowCheckout(true);
    };

    const getPrice = (plan: SubscriptionPlan) =>
        billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;

    const getSaving = (plan: SubscriptionPlan) => {
        if (plan.price_monthly === 0) return 0;
        const monthlyTotal = plan.price_monthly * 12;
        const yearlyTotal = plan.price_yearly;
        return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
    };

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-96 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Billing Cycle Toggle ──────────────────────────────────── */}
            <div className="flex items-center justify-center gap-3">
                <span className={cn("text-sm font-medium", billingCycle === "monthly" ? "text-white" : "text-sx-text-muted")}>
                    Monthly
                </span>
                <button
                    onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                    className={cn(
                        "relative h-7 w-14 rounded-full transition-colors",
                        billingCycle === "yearly" ? "bg-blue-600" : "bg-white/[0.1]",
                    )}
                >
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md",
                            billingCycle === "yearly" ? "left-[calc(100%-1.625rem)]" : "left-0.5",
                        )}
                    />
                </button>
                <span className={cn("text-sm font-medium", billingCycle === "yearly" ? "text-white" : "text-sx-text-muted")}>
                    Yearly
                </span>
                {billingCycle === "yearly" && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400"
                    >
                        Save up to 17%
                    </motion.span>
                )}
            </div>

            {/* ── Plan Cards ───────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={cn(
                            "relative flex flex-col rounded-2xl border p-6 transition-all hover:border-white/[0.12]",
                            plan.is_popular
                                ? "border-blue-500/30 bg-blue-500/[0.04] shadow-lg shadow-blue-500/5"
                                : "border-white/[0.06] bg-white/[0.02]",
                        )}
                    >
                        {/* Popular badge */}
                        {plan.is_popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20">
                                    <Crown className="h-3 w-3" />
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Plan name */}
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                            <p className="mt-1 text-xs text-sx-text-muted line-clamp-2">
                                {plan.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            {getPrice(plan) > 0 ? (
                                <>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">
                                            ₹{getPrice(plan).toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-sm text-sx-text-muted">
                                            /{billingCycle === "monthly" ? "mo" : "yr"}
                                        </span>
                                    </div>
                                    {billingCycle === "yearly" && getSaving(plan) > 0 && (
                                        <p className="mt-1 text-xs text-emerald-400">
                                            Save {getSaving(plan)}% with yearly billing
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">Custom</span>
                                </div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="mb-6 flex-1 space-y-2.5">
                            {(Array.isArray(plan.features) ? plan.features : []).map((feature, fi) => (
                                <div key={fi} className="flex items-center gap-2.5">
                                    <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500/10">
                                        <Check className="h-3 w-3 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-sx-text-subtle">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => handleSelectPlan(plan)}
                            className={cn(
                                "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                                plan.is_popular
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02]"
                                    : plan.price_monthly === 0
                                        ? "bg-white/[0.06] text-white hover:bg-white/[0.1]"
                                        : "bg-white/[0.06] text-white hover:bg-white/[0.1]",
                            )}
                        >
                            {plan.price_monthly === 0 ? (
                                <>Contact Sales</>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4" />
                                    Get {plan.name}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* ── UPI Checkout Modal ────────────────────────────────── */}
            {showCheckout && selectedPlan && (
                <UpiCheckout
                    plan={selectedPlan}
                    billingCycle={billingCycle}
                    onClose={() => {
                        setShowCheckout(false);
                        setSelectedPlan(null);
                    }}
                />
            )}
        </div>
    );
}
