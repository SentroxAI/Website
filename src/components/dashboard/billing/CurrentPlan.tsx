"use client";

/* -------------------------------------------------------------------------- */
/*                        CURRENT PLAN CARD                                   */
/*                                                                            */
/*  Sprint 4 — Module 1: Shows the client's active subscription plan.        */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Crown,
    Calendar,
    Clock,
    Check,
    ArrowUpRight,
    Zap,
    Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CurrentPlan() {
    /* In production, this would come from getClientSubscription() */
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-48 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                <div className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            </div>
        );
    }

    /* Placeholder data — will be connected to real subscription after setup */
    const hasSubscription = false;

    if (!hasSubscription) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* No plan card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                    {/* Gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-cyan-500/[0.04]" />

                    <div className="relative flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
                            <Zap className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            No Active Plan
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-sx-text-muted">
                            You don&apos;t have an active subscription yet. Choose a plan to unlock premium features and dedicated support.
                        </p>
                        <button className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]">
                            <Crown className="h-4 w-4" />
                            View Plans
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Benefits preview */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <h4 className="text-sm font-semibold text-white mb-4">
                        Why subscribe?
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            { icon: <Shield className="h-4 w-4 text-emerald-400" />, label: "Priority Support", desc: "Get help within 24 hours" },
                            { icon: <Zap className="h-4 w-4 text-amber-400" />, label: "AI Features", desc: "Access AI chatbot & automation" },
                            { icon: <Crown className="h-4 w-4 text-violet-400" />, label: "Advanced Analytics", desc: "Deep insights dashboard" },
                            { icon: <Calendar className="h-4 w-4 text-blue-400" />, label: "Regular Updates", desc: "Monthly feature updates" },
                        ].map((benefit) => (
                            <div
                                key={benefit.label}
                                className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] flex-shrink-0">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{benefit.label}</p>
                                    <p className="text-xs text-sx-text-muted">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
}
