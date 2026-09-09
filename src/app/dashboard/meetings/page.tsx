"use client";

/* -------------------------------------------------------------------------- */
/*                          MEETINGS PAGE                                     */
/*                                                                            */
/*  Module 7: Meeting management with upcoming/past sections, stats,          */
/*  and expandable meeting cards with agenda and notes.                       */
/* -------------------------------------------------------------------------- */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import DashboardSection from "@/components/dashboard/overview/DashboardSection";
import MeetingStats from "@/components/dashboard/meetings/MeetingStats";
import MeetingCard from "@/components/dashboard/meetings/MeetingCard";
import ScheduleMeetingModal from "@/components/dashboard/meetings/ScheduleMeetingModal";
import EmptyState from "@/components/dashboard/overview/EmptyState";
import { getUpcomingMeetings, getPastMeetings } from "@/components/dashboard/meetings/data";

type TabValue = "upcoming" | "past";

export default function MeetingsPage() {
    const [activeTab, setActiveTab] = useState<TabValue>("upcoming");
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    const upcoming = useMemo(() => getUpcomingMeetings(), []);
    const past = useMemo(() => getPastMeetings(), []);

    const activeMeetings = activeTab === "upcoming" ? upcoming : past;

    return (
        <DashboardContainer>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
            >
                <div>
                    <h1 className="text-xl font-bold text-white md:text-2xl">
                        Meetings
                    </h1>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        {upcoming.length} upcoming · {past.length} completed
                    </p>
                </div>

                <button
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center gap-2 rounded-xl bg-sx-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20 w-fit"
                >
                    <Plus className="h-4 w-4" />
                    Schedule Meeting
                </button>
            </motion.div>

            {/* Stats */}
            <div className="mb-6">
                <MeetingStats />
            </div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-6"
            >
                <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06] w-fit">
                    {([
                        { value: "upcoming" as const, label: "Upcoming", count: upcoming.length },
                        { value: "past" as const, label: "Past", count: past.length },
                    ]).map((tab) => {
                        const isActive = activeTab === tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    "relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                    isActive ? "text-white" : "text-sx-text-muted hover:text-sx-text-secondary"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="meeting-tab"
                                        className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative">{tab.label}</span>
                                <span className={cn(
                                    "relative rounded-full px-1.5 py-px text-[10px] tabular-nums",
                                    isActive ? "bg-sx-primary/20 text-sx-primary-400" : "bg-white/5 text-sx-text-subtle"
                                )}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Meeting list */}
            {activeMeetings.length === 0 ? (
                <EmptyState
                    icon={<Calendar className="h-6 w-6" />}
                    title={activeTab === "upcoming" ? "No upcoming meetings" : "No past meetings"}
                    description={
                        activeTab === "upcoming"
                            ? "Schedule a meeting to get started."
                            : "Completed meetings will appear here."
                    }
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                />
            ) : (
                <div className="space-y-4">
                    {activeMeetings.map((meeting, index) => (
                        <MeetingCard key={meeting.id} meeting={meeting} index={index} />
                    ))}
                </div>
            )}

            {/* Schedule Meeting Modal */}
            <ScheduleMeetingModal
                open={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
            />
        </DashboardContainer>
    );
}
