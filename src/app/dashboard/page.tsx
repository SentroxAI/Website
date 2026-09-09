"use client";

/* -------------------------------------------------------------------------- */
/*                        DASHBOARD OVERVIEW PAGE                             */
/*                                                                            */
/*  Module 3: Full dashboard overview composing all widgets.                  */
/*  Layout: Greeting → Quick Actions → Stats → Storage →                     */
/*  Progress Chart → Activity + Meetings → Projects → Files → Messages       */
/* -------------------------------------------------------------------------- */

import DashboardContainer from "@/components/dashboard/DashboardContainer";
import DashboardGreeting from "@/components/dashboard/overview/DashboardGreeting";
import DashboardSection from "@/components/dashboard/overview/DashboardSection";
import QuickActions from "@/components/dashboard/overview/QuickActions";
import StatsGrid from "@/components/dashboard/overview/StatsGrid";
import StorageCard from "@/components/dashboard/overview/StorageCard";
import ProgressChart from "@/components/dashboard/overview/ProgressChart";
import ActivityTimeline from "@/components/dashboard/overview/ActivityTimeline";
import UpcomingMeetings from "@/components/dashboard/overview/UpcomingMeetings";
import RecentProjects from "@/components/dashboard/overview/RecentProjects";
import RecentFiles from "@/components/dashboard/overview/RecentFiles";
import RecentMessages from "@/components/dashboard/overview/RecentMessages";

export default function DashboardPage() {
    return (
        <DashboardContainer>
            {/* ── Greeting ─────────────────────────────────────────────── */}
            <DashboardGreeting />

            {/* ── Quick Actions ────────────────────────────────────────── */}
            <DashboardSection title="Quick Actions" delay={0.05} className="mb-8">
                <QuickActions />
            </DashboardSection>

            {/* ── Stats + Storage Grid ─────────────────────────────────── */}
            <DashboardSection title="Overview" delay={0.1} className="mb-8">
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
                    <div className="lg:col-span-4 xl:col-span-4">
                        <StatsGrid />
                    </div>
                    <div className="lg:col-span-4 xl:col-span-1">
                        <StorageCard />
                    </div>
                </div>
            </DashboardSection>

            {/* ── Project Progress Chart ────────────────────────────────── */}
            <DashboardSection
                title="Project Progress"
                viewAllHref="/dashboard/projects"
                delay={0.15}
                className="mb-8"
            >
                <ProgressChart />
            </DashboardSection>

            {/* ── Activity + Meetings (side by side) ───────────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <DashboardSection title="Recent Activity" delay={0.2}>
                    <ActivityTimeline />
                </DashboardSection>

                <DashboardSection
                    title="Upcoming Meetings"
                    viewAllHref="/dashboard/meetings"
                    delay={0.25}
                >
                    <UpcomingMeetings />
                </DashboardSection>
            </div>

            {/* ── Recent Projects ───────────────────────────────────────── */}
            <DashboardSection
                title="Recent Projects"
                viewAllHref="/dashboard/projects"
                delay={0.3}
                className="mb-8"
            >
                <RecentProjects />
            </DashboardSection>

            {/* ── Files + Messages (side by side) ──────────────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <DashboardSection
                    title="Recent Files"
                    viewAllHref="/dashboard/files"
                    delay={0.35}
                >
                    <RecentFiles />
                </DashboardSection>

                <DashboardSection
                    title="Latest Messages"
                    viewAllHref="/dashboard/messages"
                    delay={0.4}
                >
                    <RecentMessages />
                </DashboardSection>
            </div>
        </DashboardContainer>
    );
}
