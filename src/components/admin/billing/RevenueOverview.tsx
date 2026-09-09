"use client";

/* -------------------------------------------------------------------------- */
/*                        REVENUE OVERVIEW                                    */
/*                                                                            */
/*  Sprint 4 — Module 1: Revenue stats cards + chart for admin billing.      */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    IndianRupee,
    CreditCard,
    Users,
    AlertCircle,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBillingStats } from "@/app/actions/billing";
import type { BillingStats } from "@/types/billing";

/* ── Stat Card ─────────────────────────────────────────────────────────────── */

function StatCard({
    label,
    value,
    change,
    icon,
    color,
    delay,
}: {
    label: string;
    value: string;
    change?: string;
    icon: React.ReactNode;
    color: string;
    delay: number;
}) {
    const isPositive = change && !change.startsWith("-");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-sx-text-muted uppercase tracking-wider">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                    {change && (
                        <div className="mt-2 flex items-center gap-1">
                            {isPositive ? (
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                            )}
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    isPositive ? "text-emerald-400" : "text-red-400",
                                )}
                            >
                                {change} vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        color,
                    )}
                >
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}

/* ── Revenue Bar ───────────────────────────────────────────────────────────── */

function RevenueBar({
    label,
    amount,
    maxAmount,
    delay,
}: {
    label: string;
    amount: number;
    maxAmount: number;
    delay: number;
}) {
    const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="group flex items-center gap-4"
        >
            <span className="w-12 text-right text-xs text-sx-text-muted">{label}</span>
            <div className="flex-1 h-8 rounded-lg bg-white/[0.04] overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-end pr-2"
                >
                    {percentage > 15 && (
                        <span className="text-[10px] font-semibold text-white">
                            ₹{(amount / 1000).toFixed(0)}k
                        </span>
                    )}
                </motion.div>
            </div>
            <span className="w-20 text-right text-xs text-sx-text-subtle">
                ₹{amount.toLocaleString("en-IN")}
            </span>
        </motion.div>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function RevenueOverview() {
    const [stats, setStats] = useState<BillingStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getBillingStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load billing stats:", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>
        );
    }

    const formatCurrency = (amount: number) =>
        `₹${amount.toLocaleString("en-IN")}`;

    /* ── Sample monthly data for chart ──────────────────────────────── */
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const monthlyRevenue = [45000, 62000, 58000, 85000, 92000, 78000, 110000, stats?.monthlyRevenue || 0];
    const maxRevenue = Math.max(...monthlyRevenue);

    return (
        <div className="space-y-8">
            {/* ── Stat Cards ───────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Revenue"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    icon={<IndianRupee className="h-5 w-5 text-emerald-400" />}
                    color="bg-emerald-500/10"
                    delay={0}
                />
                <StatCard
                    label="Monthly Revenue"
                    value={formatCurrency(stats?.monthlyRevenue || 0)}
                    change={stats?.revenueGrowth ? `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}%` : undefined}
                    icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
                    color="bg-blue-500/10"
                    delay={0.05}
                />
                <StatCard
                    label="Active Subscriptions"
                    value={String(stats?.activeSubscriptions || 0)}
                    icon={<Users className="h-5 w-5 text-violet-400" />}
                    color="bg-violet-500/10"
                    delay={0.1}
                />
                <StatCard
                    label="Overdue Invoices"
                    value={String(stats?.overdueInvoices || 0)}
                    icon={<AlertCircle className="h-5 w-5 text-amber-400" />}
                    color="bg-amber-500/10"
                    delay={0.15}
                />
            </div>

            {/* ── Revenue Chart ────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-white">
                            Revenue Trend
                        </h3>
                        <p className="text-xs text-sx-text-muted">
                            Monthly revenue over the past 8 months
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1">
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">
                            {stats?.revenueGrowth || 0}% growth
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {months.map((month, i) => (
                        <RevenueBar
                            key={month}
                            label={month}
                            amount={monthlyRevenue[i]}
                            maxAmount={maxRevenue}
                            delay={0.25 + i * 0.04}
                        />
                    ))}
                </div>
            </motion.div>

            {/* ── Quick Actions ─────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="grid gap-4 sm:grid-cols-3"
            >
                {[
                    { label: "Pending Payments", count: stats?.pendingPayments || 0, color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Failed Payments", count: 0, color: "text-red-400", bg: "bg-red-500/10" },
                    { label: "Refunds This Month", count: 0, color: "text-blue-400", bg: "bg-blue-500/10" },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", item.bg)}>
                            <CreditCard className={cn("h-5 w-5", item.color)} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{item.count}</p>
                            <p className="text-xs text-sx-text-muted">{item.label}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
