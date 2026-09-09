"use client";

/* -------------------------------------------------------------------------- */
/*                       LIVE ACTIVITY FEED                                   */
/*                                                                            */
/*  Sprint 4 — Module 3: Real-time activity stream on the dashboard.         */
/*  Shows project updates, new messages, meetings, payments in a live feed.  */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    MessageSquare,
    FolderKanban,
    Calendar,
    CreditCard,
    FileText,
    UserPlus,
    Bell,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtimeSubscription } from "@/hooks/use-realtime";
import type { AppNotification, NotificationType } from "@/lib/supabase/realtime";

/* ── Config ────────────────────────────────────────────────────────────────── */

const typeConfig: Record<
    NotificationType,
    { icon: React.ReactNode; color: string; bg: string }
> = {
    message: {
        icon: <MessageSquare className="h-3.5 w-3.5" />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
    },
    project_update: {
        icon: <FolderKanban className="h-3.5 w-3.5" />,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
    meeting: {
        icon: <Calendar className="h-3.5 w-3.5" />,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
    },
    payment: {
        icon: <CreditCard className="h-3.5 w-3.5" />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    invoice: {
        icon: <FileText className="h-3.5 w-3.5" />,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
    file: {
        icon: <FileText className="h-3.5 w-3.5" />,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
    },
    system: {
        icon: <Bell className="h-3.5 w-3.5" />,
        color: "text-gray-400",
        bg: "bg-gray-500/10",
    },
    lead: {
        icon: <UserPlus className="h-3.5 w-3.5" />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
    },
};

/* ── Activity item type ────────────────────────────────────────────────────── */

interface ActivityItem {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    time: string;
    isNew?: boolean;
}

/* ── Time formatting ───────────────────────────────────────────────────────── */

function getRelativeTime(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface LiveActivityFeedProps {
    userId?: string;
    maxItems?: number;
    className?: string;
}

export default function LiveActivityFeed({
    userId,
    maxItems = 10,
    className,
}: LiveActivityFeedProps) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);

    /* ── Real-time listener ─────────────────────────────────────────── */
    useRealtimeSubscription<AppNotification>(
        {
            table: "notifications",
            filter: userId ? `user_id=eq.${userId}` : undefined,
            onInsert: (notification) => {
                const newItem: ActivityItem = {
                    id: notification.id,
                    type: notification.type,
                    title: notification.title,
                    body: notification.body,
                    time: notification.created_at,
                    isNew: true,
                };

                setActivities((prev) => {
                    const updated = [newItem, ...prev].slice(0, maxItems);
                    return updated;
                });

                // Remove "new" flag after 5 seconds
                setTimeout(() => {
                    setActivities((prev) =>
                        prev.map((a) =>
                            a.id === notification.id ? { ...a, isNew: false } : a,
                        ),
                    );
                }, 5000);
            },
        },
        !!userId,
    );

    /* ── Static fallback items ──────────────────────────────────────── */
    useEffect(() => {
        // Show some placeholder activity items when no real data
        if (activities.length === 0 && !loading) {
            setActivities([
                {
                    id: "static-1",
                    type: "system",
                    title: "Real-time feed active",
                    body: "New activities will appear here in real-time",
                    time: new Date().toISOString(),
                },
            ]);
        }
    }, []);

    const handleRefresh = useCallback(() => {
        setLoading(true);
        // Simulate a refresh — in production, fetch recent notifications
        setTimeout(() => setLoading(false), 500);
    }, []);

    return (
        <div
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden",
                className,
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-white">
                        Live Activity
                    </h3>
                    {/* Live pulse */}
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                    )}
                </button>
            </div>

            {/* Activity list */}
            <div className="max-h-[400px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
                <AnimatePresence mode="popLayout">
                    {activities.map((item) => {
                        const config = typeConfig[item.type] || typeConfig.system;

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "flex items-start gap-3 px-5 py-3 border-b border-white/[0.03] transition-colors",
                                    item.isNew && "bg-cyan-500/[0.03]",
                                )}
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                        config.bg,
                                        config.color,
                                    )}
                                >
                                    {config.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm text-white leading-tight">
                                            {item.title}
                                        </p>
                                        {item.isNew && (
                                            <span className="shrink-0 rounded-full bg-cyan-500/20 px-1.5 py-px text-[9px] font-semibold text-cyan-400">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    {item.body && (
                                        <p className="mt-0.5 text-xs text-sx-text-muted truncate">
                                            {item.body}
                                        </p>
                                    )}
                                    <p className="mt-1 text-[10px] text-sx-text-subtle">
                                        {getRelativeTime(item.time)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-5 py-2.5 text-center">
                <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    View all activity
                </button>
            </div>
        </div>
    );
}
