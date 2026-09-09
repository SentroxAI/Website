"use client";

/* -------------------------------------------------------------------------- */
/*                        UPCOMING MEETINGS                                   */
/*                                                                            */
/*  List of upcoming meetings with date, time, client, platform, join btn.    */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { meetingsData } from "./data";
import EmptyState from "./EmptyState";

/* ── Platform config ───────────────────────────────────────────────────────── */

const platformConfig = {
    "google-meet": { label: "Google Meet", color: "text-emerald-400 bg-emerald-500/10" },
    zoom: { label: "Zoom", color: "text-blue-400 bg-blue-500/10" },
    teams: { label: "Teams", color: "text-violet-400 bg-violet-500/10" },
};

/* ── Date formatter ────────────────────────────────────────────────────────── */

function formatMeetingDate(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function UpcomingMeetings() {
    if (meetingsData.length === 0) {
        return (
            <EmptyState
                icon={<Calendar className="h-6 w-6" />}
                title="No upcoming meetings"
                description="Schedule a meeting to see it appear here."
                action={{
                    label: "Book Meeting",
                    onClick: () => {},
                }}
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="divide-y divide-white/[0.04]">
                {meetingsData.map((meeting, index) => {
                    const platform = platformConfig[meeting.platform];

                    return (
                        <motion.div
                            key={meeting.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.06,
                                ease: "easeOut",
                            }}
                            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]"
                        >
                            {/* Date block */}
                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                <Calendar className="h-4 w-4 mb-0.5" />
                                <span className="text-[10px] font-semibold leading-none">
                                    {formatMeetingDate(meeting.date)}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {meeting.title}
                                </p>
                                <div className="mt-1 flex items-center gap-3 text-xs text-sx-text-muted">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {meeting.time} · {meeting.duration}
                                    </span>
                                    <span className="truncate">{meeting.client}</span>
                                </div>
                            </div>

                            {/* Platform badge */}
                            <span
                                className={cn(
                                    "hidden sm:inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium",
                                    platform.color
                                )}
                            >
                                <Video className="h-3 w-3" />
                                {platform.label}
                            </span>

                            {/* Join button */}
                            <a
                                href={meeting.link}
                                className="flex h-8 items-center gap-1.5 rounded-lg bg-sx-primary-600 px-3 text-xs font-medium text-white transition-colors hover:bg-sx-primary-500 shadow-md shadow-sx-primary/15"
                            >
                                Join
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
