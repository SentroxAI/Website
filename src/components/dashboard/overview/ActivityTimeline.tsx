"use client";

/* -------------------------------------------------------------------------- */
/*                        ACTIVITY TIMELINE                                   */
/*                                                                            */
/*  Vertical timeline showing recent activity events.                         */
/*  Each event has typed icon, title, description, and relative time.         */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    FolderKanban,
    Receipt,
    Calendar,
    FileText,
    MessageSquare,
    Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { activityData, type ActivityItem } from "./data";
import EmptyState from "./EmptyState";

/* ── Type config ───────────────────────────────────────────────────────────── */

const typeConfig: Record<
    ActivityItem["type"],
    { icon: React.ReactNode; bg: string; text: string }
> = {
    project: {
        icon: <FolderKanban className="h-3.5 w-3.5" />,
        bg: "bg-blue-500/15",
        text: "text-blue-400",
    },
    invoice: {
        icon: <Receipt className="h-3.5 w-3.5" />,
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
    },
    meeting: {
        icon: <Calendar className="h-3.5 w-3.5" />,
        bg: "bg-violet-500/15",
        text: "text-violet-400",
    },
    file: {
        icon: <FileText className="h-3.5 w-3.5" />,
        bg: "bg-amber-500/15",
        text: "text-amber-400",
    },
    message: {
        icon: <MessageSquare className="h-3.5 w-3.5" />,
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
    },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function ActivityTimeline() {
    if (activityData.length === 0) {
        return (
            <EmptyState
                icon={<Inbox className="h-6 w-6" />}
                title="No recent activity"
                description="Your activity timeline will appear here once you start working on projects."
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="relative space-y-0">
                {activityData.map((item, index) => {
                    const config = typeConfig[item.type];
                    const isLast = index === activityData.length - 1;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.06,
                                ease: "easeOut",
                            }}
                            className="relative flex gap-3 pb-5 last:pb-0"
                        >
                            {/* Timeline line */}
                            {!isLast && (
                                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-white/[0.06]" />
                            )}

                            {/* Icon */}
                            <div
                                className={cn(
                                    "relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg",
                                    config.bg,
                                    config.text
                                )}
                            >
                                {config.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-sm font-medium text-sx-text-secondary leading-snug">
                                    {item.title}
                                </p>
                                <p className="mt-0.5 text-xs text-sx-text-muted line-clamp-1">
                                    {item.description}
                                </p>
                            </div>

                            {/* Time */}
                            <span className="shrink-0 pt-1 text-[11px] text-sx-text-subtle">
                                {item.relativeTime}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
