"use client";

/* -------------------------------------------------------------------------- */
/*                           PLAN MANAGER (ADMIN)                             */
/*                                                                            */
/*  Sprint 4 — Module 1: Manage subscription plans.                          */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    Crown,
    Package,
    IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllPlans, updatePlan, deactivatePlan } from "@/app/actions/billing";
import type { SubscriptionPlan } from "@/types/billing";

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function PlanManager() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPriceMonthly, setEditPriceMonthly] = useState("");
    const [editPriceYearly, setEditPriceYearly] = useState("");

    const loadPlans = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllPlans();
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

    const handleEdit = (plan: SubscriptionPlan) => {
        setEditingId(plan.id);
        setEditPriceMonthly(String(plan.price_monthly));
        setEditPriceYearly(String(plan.price_yearly));
    };

    const handleSave = async (planId: string) => {
        const result = await updatePlan(planId, {
            price_monthly: Number(editPriceMonthly),
            price_yearly: Number(editPriceYearly),
        });

        if (result.success) {
            setEditingId(null);
            loadPlans();
        }
    };

    const handleDeactivate = async (planId: string) => {
        if (!confirm("Are you sure you want to deactivate this plan?")) return;
        const result = await deactivatePlan(planId);
        if (result.success) loadPlans();
    };

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-64 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-white">
                        Subscription Plans
                    </h3>
                    <p className="text-xs text-sx-text-muted">
                        {plans.filter((p) => p.is_active).length} active plans
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Plan
                </button>
            </div>

            {/* ── Plan Cards ───────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className={cn(
                            "relative rounded-2xl border p-6 transition-all",
                            plan.is_popular
                                ? "border-blue-500/30 bg-blue-500/[0.04]"
                                : "border-white/[0.06] bg-white/[0.02]",
                            !plan.is_active && "opacity-50",
                        )}
                    >
                        {/* Popular badge */}
                        {plan.is_popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                    <Crown className="h-3 w-3" />
                                    Popular
                                </span>
                            </div>
                        )}

                        {/* Plan header */}
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                            <p className="mt-1 text-xs text-sx-text-muted line-clamp-2">
                                {plan.description}
                            </p>
                        </div>

                        {/* Pricing */}
                        {editingId === plan.id ? (
                            <div className="mb-4 space-y-2">
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-wider text-sx-text-muted">Monthly Price</span>
                                    <div className="relative mt-1">
                                        <IndianRupee className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sx-text-subtle" />
                                        <input
                                            type="number"
                                            value={editPriceMonthly}
                                            onChange={(e) => setEditPriceMonthly(e.target.value)}
                                            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] py-2 pl-8 pr-3 text-sm text-white focus:border-blue-500/50 focus:outline-none"
                                        />
                                    </div>
                                </label>
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-wider text-sx-text-muted">Yearly Price</span>
                                    <div className="relative mt-1">
                                        <IndianRupee className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sx-text-subtle" />
                                        <input
                                            type="number"
                                            value={editPriceYearly}
                                            onChange={(e) => setEditPriceYearly(e.target.value)}
                                            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] py-2 pl-8 pr-3 text-sm text-white focus:border-blue-500/50 focus:outline-none"
                                        />
                                    </div>
                                </label>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => handleSave(plan.id)}
                                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                                    >
                                        <Check className="h-3.5 w-3.5" /> Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-sx-text-muted hover:bg-white/[0.1] transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                {plan.price_monthly > 0 ? (
                                    <>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-white">
                                                ₹{plan.price_monthly.toLocaleString("en-IN")}
                                            </span>
                                            <span className="text-sm text-sx-text-muted">/mo</span>
                                        </div>
                                        <p className="mt-1 text-xs text-sx-text-subtle">
                                            ₹{plan.price_yearly.toLocaleString("en-IN")}/year
                                        </p>
                                    </>
                                ) : (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">
                                            Custom
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Features */}
                        <div className="mb-4 space-y-2">
                            {(Array.isArray(plan.features) ? plan.features : []).slice(0, 5).map((feature, fi) => (
                                <div key={fi} className="flex items-center gap-2 text-xs text-sx-text-subtle">
                                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                            {(Array.isArray(plan.features) ? plan.features : []).length > 5 && (
                                <p className="text-[10px] text-sx-text-muted pl-5.5">
                                    +{(plan.features as string[]).length - 5} more features
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        {editingId !== plan.id && (
                            <div className="flex gap-2 border-t border-white/[0.06] pt-4">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-2 text-xs font-medium text-sx-text-subtle hover:bg-white/[0.1] hover:text-white transition-colors"
                                >
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </button>
                                {plan.is_active && (
                                    <button
                                        onClick={() => handleDeactivate(plan.id)}
                                        className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Deactivate
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Status indicator */}
                        <div className="absolute top-4 right-4">
                            <span
                                className={cn(
                                    "inline-flex h-2 w-2 rounded-full",
                                    plan.is_active ? "bg-emerald-400" : "bg-red-400",
                                )}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Empty State ──────────────────────────────────────────── */}
            {plans.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-16">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 mb-3">
                        <Package className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-white">No plans configured</p>
                    <p className="mt-1 text-xs text-sx-text-muted">
                        Add your first subscription plan to start accepting payments
                    </p>
                </div>
            )}
        </div>
    );
}
