"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN ANALYTICS PAGE                                  */
/*                                                                            */
/*  Sprint 3 — Module 8: Cross-table analytics dashboard.                    */
/*  Layout: Header → KPI Cards → Charts (2×2 grid) → Content Metrics        */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, RefreshCw } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import {
    DynamicAnalyticsKPICards as AnalyticsKPICards,
    DynamicLeadSourceChart as LeadSourceChart,
    DynamicMonthlyTrendsChart as MonthlyTrendsChart,
    DynamicProjectStatusChart as ProjectStatusChart,
    DynamicContentMetricsPanel as ContentMetricsPanel,
} from "@/lib/dynamic-imports";
import { fetchAnalytics, type AnalyticsData } from "@/app/actions/analytics";

export default function AnalyticsPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(async (showLoader = false) => {
        if (showLoader) setLoading(true);
        setRefreshing(true);

        const result = await fetchAnalytics();
        setData(result.data);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        loadData(true);
    }, [loadData]);

    /* ── Render ───────────────────────────────────────────────────────────── */
    return (
        <AdminContainer>
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
                        <BarChart3 className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Analytics</h1>
                        <p className="text-sm text-sx-text-muted">
                            Agency performance insights
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => loadData(false)}
                    disabled={refreshing}
                    className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white disabled:opacity-50"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </motion.div>

            {loading || !data ? (
                <LoadingSkeleton />
            ) : (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <AdminSection title="Key Performance Indicators" delay={0.05}>
                        <AnalyticsKPICards kpi={data.kpi} />
                    </AdminSection>

                    {/* Charts row 1: Lead Source + Monthly Trends */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminSection title="Lead Sources" delay={0.1}>
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                                <LeadSourceChart data={data.leadsBySource} />
                            </div>
                        </AdminSection>

                        <AdminSection title="Monthly Trends" delay={0.15}>
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                                <MonthlyTrendsChart data={data.monthlyTrends} />
                            </div>
                        </AdminSection>
                    </div>

                    {/* Charts row 2: Project Status + Content Metrics */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <AdminSection title="Project Distribution" delay={0.2}>
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                                <ProjectStatusChart data={data.projectsByStatus} />
                            </div>
                        </AdminSection>

                        <AdminSection title="Content Analytics" delay={0.25}>
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                                <ContentMetricsPanel metrics={data.contentMetrics} />
                            </div>
                        </AdminSection>
                    </div>
                </div>
            )}
        </AdminContainer>
    );
}

/* ── Loading Skeleton ────────────────────────────────────────────────────────── */

function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* KPI row */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-8">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="h-24 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>

            {/* Chart row 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-[320px] rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                <div className="h-[320px] rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            </div>

            {/* Chart row 2 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-[260px] rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                <div className="h-[260px] rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            </div>
        </div>
    );
}
