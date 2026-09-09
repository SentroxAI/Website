"use client";

/* -------------------------------------------------------------------------- */
/*                       MEETING STATS BAR                                    */
/*                                                                            */
/*  Summary cards: upcoming count, total this month, hours scheduled.         */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { meetings, getUpcomingMeetings, getPastMeetings } from "./data";

export default function MeetingStats() {
    const upcoming = getUpcomingMeetings();
    const past = getPastMeetings();
    const totalHours = meetings.reduce((sum, m) => sum + m.durationMinutes, 0) / 60;
    const completedCount = meetings.filter((m) => m.status === "completed").length;

    const stats = [
        {
            label: "Upcoming",
            value: upcoming.length,
            icon: <Calendar className="h-4 w-4" />,
            bg: "bg-blue-500/10",
            text: "text-blue-400",
        },
        {
            label: "Completed",
            value: completedCount,
            icon: <CheckCircle2 className="h-4 w-4" />,
            bg: "bg-emerald-500/10",
            text: "text-emerald-400",
        },
        {
            label: "Total Meetings",
            value: meetings.length,
            icon: <Video className="h-4 w-4" />,
            bg: "bg-violet-500/10",
            text: "text-violet-400",
        },
        {
            label: "Hours Scheduled",
            value: `${totalHours.toFixed(1)}h`,
            icon: <Clock className="h-4 w-4" />,
            bg: "bg-amber-500/10",
            text: "text-amber-400",
        },
    ];

    return (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} ${stat.text}`}>
                            {stat.icon}
                        </div>
                    </div>
                    <p className="text-xl font-bold text-white tabular-nums">{stat.value}</p>
                    <p className="text-[11px] text-sx-text-muted mt-0.5">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
