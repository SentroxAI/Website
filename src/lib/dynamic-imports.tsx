/* -------------------------------------------------------------------------- */
/*                      DYNAMIC IMPORT REGISTRY                               */
/*                                                                            */
/*  Sprint 4 — Module 8: Performance optimization via code splitting.         */
/*  Lazily loads heavy components (charts, editors, file managers) so they     */
/*  don't bloat the initial JS bundle. Each export is a next/dynamic          */
/*  wrapper with a loading skeleton.                                          */
/* -------------------------------------------------------------------------- */

import dynamic from "next/dynamic";

/* ── Loading Skeletons ─────────────────────────────────────────────────────── */

function ChartSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-4 h-4 w-32 rounded bg-white/[0.06]" />
            <div className="h-64 rounded-xl bg-white/[0.04]" />
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="mb-3 h-3 w-24 rounded bg-white/[0.06]" />
            <div className="h-8 w-40 rounded bg-white/[0.04]" />
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="h-4 w-48 rounded bg-white/[0.06]" />
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-white/[0.03]" />
            ))}
        </div>
    );
}

function FullPageSkeleton() {
    return (
        <div className="animate-pulse space-y-4 p-6">
            <div className="h-8 w-64 rounded bg-white/[0.06]" />
            <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/[0.03]" />
                ))}
            </div>
            <div className="h-96 rounded-2xl bg-white/[0.03]" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      ADMIN ANALYTICS CHARTS                                */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const DynamicLeadSourceChart = dynamic(
    () => import("@/components/admin/analytics/LeadSourceChart"),
    { loading: () => <ChartSkeleton />, ssr: false },
);

export const DynamicMonthlyTrendsChart = dynamic(
    () => import("@/components/admin/analytics/MonthlyTrendsChart"),
    { loading: () => <ChartSkeleton />, ssr: false },
);

export const DynamicProjectStatusChart = dynamic(
    () => import("@/components/admin/analytics/ProjectStatusChart"),
    { loading: () => <ChartSkeleton />, ssr: false },
);

export const DynamicContentMetricsPanel = dynamic(
    () => import("@/components/admin/analytics/ContentMetricsPanel"),
    { loading: () => <ChartSkeleton />, ssr: false },
);

export const DynamicAnalyticsKPICards = dynamic(
    () => import("@/components/admin/analytics/AnalyticsKPICards"),
    { loading: () => <CardSkeleton /> },
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      ADMIN BILLING                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const DynamicRevenueOverview = dynamic(
    () => import("@/components/admin/billing/RevenueOverview"),
    { loading: () => <ChartSkeleton />, ssr: false },
);

export const DynamicPlanManager = dynamic(
    () => import("@/components/admin/billing/PlanManager"),
    { loading: () => <TableSkeleton /> },
);

export const DynamicPaymentHistory = dynamic(
    () => import("@/components/admin/billing/PaymentHistory"),
    { loading: () => <TableSkeleton /> },
);

export const DynamicInvoiceManager = dynamic(
    () => import("@/components/admin/billing/InvoiceManager"),
    { loading: () => <TableSkeleton /> },
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      AI TOOLS                                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const DynamicProposalGenerator = dynamic(
    () => import("@/components/admin/ai/ProposalGenerator"),
    { loading: () => <FullPageSkeleton /> },
);

export const DynamicWebsiteAuditor = dynamic(
    () => import("@/components/admin/ai/WebsiteAuditor"),
    { loading: () => <FullPageSkeleton /> },
);

export const DynamicContentGenerator = dynamic(
    () => import("@/components/admin/ai/ContentGenerator"),
    { loading: () => <FullPageSkeleton /> },
);

export const DynamicAIAssistant = dynamic(
    () => import("@/components/admin/ai/AIAssistant"),
    { loading: () => <FullPageSkeleton /> },
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      DASHBOARD — CLIENT-SIDE                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const DynamicFileManager = dynamic(
    () => import("@/components/dashboard/files/FileManager"),
    { loading: () => <FullPageSkeleton /> },
);

export const DynamicRazorpayCheckout = dynamic(
    () => import("@/components/dashboard/billing/RazorpayCheckout"),
    { loading: () => <CardSkeleton />, ssr: false },
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      COMMON — HEAVY COMPONENTS                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

export const DynamicFileUpload = dynamic(
    () => import("@/components/common/FileUpload"),
    { loading: () => <CardSkeleton /> },
);

export const DynamicFilePreview = dynamic(
    () => import("@/components/common/FilePreview"),
    { loading: () => <CardSkeleton />, ssr: false },
);
