"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN ACTIVITY FEED                                   */
/*                                                                            */
/*  Timeline list of recent agency activities with type-based icons/colors.   */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    UserPlus,
    Users,
    FolderKanban,
    Receipt,
    UsersRound,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recentActivities, type ActivityType, type RecentActivity } from "./data";

/* ── Icon + color mapping ──────────────────────────────────────────────────── */

const typeConfig: Record<
    ActivityType,
    { icon: React.ReactNode; bg: string; text: string; ring: string }
> = {
    lead: {
        icon: <UserPlus className="h-3.5 w-3.5" />,
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        ring: "ring-violet-500/20",
    },
    client: {
        icon: <Users className="h-3.5 w-3.5" />,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        ring: "ring-blue-500/20",
    },
    project: {
        icon: <FolderKanban className="h-3.5 w-3.5" />,
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        ring: "ring-cyan-500/20",
    },
    invoice: {
        icon: <Receipt className="h-3.5 w-3.5" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        ring: "ring-emerald-500/20",
    },
    team: {
        icon: <UsersRound className="h-3.5 w-3.5" />,
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        ring: "ring-amber-500/20",
    },
    meeting: {
        icon: <Calendar className="h-3.5 w-3.5" />,
        bg: "bg-pink-500/10",
        text: "text-pink-400",
        ring: "ring-pink-500/20",
    },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function AdminActivityFeed({ className }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5",
                className
            )}
        >
            <div className="space-y-0">
                {recentActivities.map((activity, index) => (
                    <ActivityItem
                        key={activity.id}
                        activity={activity}
                        index={index}
                        isLast={index === recentActivities.length - 1}
                    />
                ))}
            </div>
        </motion.div>
    );
}

function ActivityItem({
    activity,
    index,
    isLast,
}: {
    activity: RecentActivity;
    index: number;
    isLast: boolean;
}) {
    const config = typeConfig[activity.type];

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex gap-3 group"
        >
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
                <div
                    className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1",
                        config.bg,
                        config.text,
                        config.ring
                    )}
                >
                    {config.icon}
                </div>
                {!isLast && (
                    <div className="w-px flex-1 bg-white/[0.06] my-1" />
                )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                <p className="text-sm font-medium text-white leading-snug">
                    {activity.title}
                </p>
                <p className="mt-0.5 text-xs text-sx-text-muted leading-relaxed line-clamp-2">
                    {activity.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-sx-text-subtle">
                    <span>{activity.time}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                    <span>{activity.user}</span>
                </div>
            </div>
        </motion.div>
    );
}
