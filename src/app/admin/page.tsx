"use client";

/* -------------------------------------------------------------------------- */
/*                        ADMIN DASHBOARD HOME                                */
/*                                                                            */
/*  Sprint 3 — Module 2: Full admin overview page.                           */
/*  Layout: Greeting → Stats → Revenue/Charts → Pipeline/Activity →          */
/*  Clients/Deadlines                                                         */
/* -------------------------------------------------------------------------- */

import AdminContainer from "@/components/admin/AdminContainer";
import AdminGreeting from "@/components/admin/overview/AdminGreeting";
import AdminSection from "@/components/admin/overview/AdminSection";
import AdminStatCards from "@/components/admin/overview/AdminStatCards";
import RevenueChart from "@/components/admin/overview/RevenueChart";
import MiniBarChart from "@/components/admin/overview/MiniBarChart";
import PipelineFunnel from "@/components/admin/overview/PipelineFunnel";
import AdminActivityFeed from "@/components/admin/overview/AdminActivityFeed";
import TopClientsTable from "@/components/admin/overview/TopClientsTable";
import UpcomingDeadlines from "@/components/admin/overview/UpcomingDeadlines";
import { leadsChartData, projectsChartData } from "@/components/admin/overview/data";

export default function AdminPage() {
    return (
        <AdminContainer>
            {/* ── Greeting ─────────────────────────────────────────────── */}
            <AdminGreeting />

            {/* ── Key Metrics ──────────────────────────────────────────── */}
            <AdminSection title="Key Metrics" delay={0.05} className="mb-8">
                <AdminStatCards />
            </AdminSection>

            {/* ── Revenue & Performance ─────────────────────────────────── */}
            <AdminSection title="Revenue & Performance" delay={0.1} className="mb-8">
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                    {/* Main revenue chart */}
                    <RevenueChart />

                    {/* Mini charts stack */}
                    <div className="grid gap-4 grid-rows-2">
                        <MiniBarChart
                            data={leadsChartData}
                            title="New Leads"
                            subtitle="Monthly acquisition"
                            color="#8b5cf6"
                            formatValue={(v) => `${v} leads`}
                        />
                        <MiniBarChart
                            data={projectsChartData}
                            title="Active Projects"
                            subtitle="Running projects"
                            color="#06b6d4"
                            formatValue={(v) => `${v} projects`}
                        />
                    </div>
                </div>
            </AdminSection>

            {/* ── Pipeline + Activity (side by side) ───────────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <AdminSection
                    title="Lead Pipeline"
                    viewAllHref="/admin/leads"
                    delay={0.15}
                >
                    <PipelineFunnel />
                </AdminSection>

                <AdminSection
                    title="Recent Activity"
                    delay={0.2}
                >
                    <AdminActivityFeed />
                </AdminSection>
            </div>

            {/* ── Top Clients + Deadlines (side by side) ───────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <AdminSection
                    title="Top Clients"
                    viewAllHref="/admin/clients"
                    delay={0.25}
                >
                    <TopClientsTable />
                </AdminSection>

                <AdminSection
                    title="Upcoming Deadlines"
                    viewAllHref="/admin/projects"
                    delay={0.3}
                >
                    <UpcomingDeadlines />
                </AdminSection>
            </div>
        </AdminContainer>
    );
}
