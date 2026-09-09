"use client";

/* -------------------------------------------------------------------------- */
/*                          NOTIFICATION BELL                                 */
/*                                                                            */
/*  Sprint 4 — Module 3: Real-time notification bell with live updates.      */
/*  Uses Supabase Realtime to push new notifications instantly.              */
/* -------------------------------------------------------------------------- */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    MessageSquare,
    FolderKanban,
    Calendar,
    FileText,
    CreditCard,
    UserPlus,
    CheckCheck,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealtimeNotifications } from "@/hooks/use-realtime";
import { createClient } from "@/lib/supabase/client";
import type { NotificationType, AppNotification } from "@/lib/supabase/realtime";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: NotificationType;
}

/* ── Config ────────────────────────────────────────────────────────────────── */

const typeIcons: Record<NotificationType, React.ReactNode> = {
    message: <MessageSquare className="h-4 w-4" />,
    project_update: <FolderKanban className="h-4 w-4" />,
    meeting: <Calendar className="h-4 w-4" />,
    payment: <CreditCard className="h-4 w-4" />,
    invoice: <FileText className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
    system: <Bell className="h-4 w-4" />,
    lead: <UserPlus className="h-4 w-4" />,
};

const typeColors: Record<NotificationType, string> = {
    message: "text-sx-primary-400 bg-sx-primary/15",
    project_update: "text-purple-400 bg-purple-500/15",
    meeting: "text-sx-warning bg-sx-warning-bg",
    payment: "text-emerald-400 bg-emerald-500/15",
    invoice: "text-cyan-400 bg-cyan-500/15",
    file: "text-sx-success bg-sx-success-bg",
    system: "text-gray-400 bg-gray-500/15",
    lead: "text-pink-400 bg-pink-500/15",
};

/* ── Time formatting ───────────────────────────────────────────────────────── */

function getRelativeTime(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

/* ── Mock fallback (used when no DB connection) ────────────────────────────── */

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "New message received",
        description: "John sent you a message about the project",
        time: "2 min ago",
        read: false,
        type: "message",
    },
    {
        id: "2",
        title: "Project milestone reached",
        description: "Website Redesign is 75% complete",
        time: "1 hour ago",
        read: false,
        type: "project_update",
    },
    {
        id: "3",
        title: "Meeting scheduled",
        description: "Design review tomorrow at 10:00 AM",
        time: "3 hours ago",
        read: false,
        type: "meeting",
    },
    {
        id: "4",
        title: "File uploaded",
        description: "brand-guidelines.pdf was uploaded",
        time: "Yesterday",
        read: true,
        type: "file",
    },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState<string | undefined>();
    const [dbNotifications, setDbNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    /* ── Get current user ──────────────────────────────────────────── */
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id);
        });
    }, []);

    /* ── Real-time notifications ───────────────────────────────────── */
    const {
        notifications: realtimeNotifications,
        unreadCount: rtUnreadCount,
        markAsRead,
        markAllRead,
    } = useRealtimeNotifications(userId);

    /* ── Fetch initial notifications from DB ────────────────────────── */
    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(20);

            if (data && data.length > 0) {
                setDbNotifications(
                    data.map((n: AppNotification) => ({
                        id: n.id,
                        title: n.title,
                        description: n.body,
                        time: getRelativeTime(n.created_at),
                        read: n.read,
                        type: n.type,
                    })),
                );
            }
        } catch {
            // DB not available — use mocks
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId && open) {
            fetchNotifications();
        }
    }, [userId, open, fetchNotifications]);

    /* ── Merge real-time + DB notifications ─────────────────────────── */
    const notifications: Notification[] = dbNotifications.length > 0
        ? [
              // Prepend any real-time notifications not already in DB list
              ...realtimeNotifications
                  .filter((rt) => !dbNotifications.some((db) => db.id === rt.id))
                  .map((n) => ({
                      id: n.id,
                      title: n.title,
                      description: n.body,
                      time: getRelativeTime(n.created_at),
                      read: n.read,
                      type: n.type,
                  })),
              ...dbNotifications,
          ]
        : mockNotifications;

    const unreadCount =
        dbNotifications.length > 0
            ? notifications.filter((n) => !n.read).length + rtUnreadCount
            : mockNotifications.filter((n) => !n.read).length;

    /* ── Mark all as read ───────────────────────────────────────────── */
    const handleMarkAllRead = async () => {
        setMarkingAll(true);
        await markAllRead();
        setDbNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setMarkingAll(false);
    };

    /* ── Click outside ─────────────────────────────────────────────── */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    /* ── Escape key ────────────────────────────────────────────────── */
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        if (open) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open]);

    /* ── Handle notification click ─────────────────────────────────── */
    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read && dbNotifications.length > 0) {
            await markAsRead(notification.id);
            setDbNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
            );
        }
        setOpen(false);
    };

    return (
        <div ref={menuRef} className="relative">
            {/* Bell trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-sx-text-muted hover:bg-white/5 hover:text-white transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-[18px] w-[18px]" />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sx-primary-500 px-1 text-[9px] font-bold text-white shadow-lg shadow-sx-primary/30"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e]/95 backdrop-blur-xl shadow-2xl shadow-black/30 z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                            <h3 className="text-sm font-semibold text-white">
                                Notifications
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-sx-primary/15 px-2 py-0.5 text-[10px] font-semibold text-sx-primary-400">
                                        {unreadCount} new
                                    </span>
                                )}
                                {unreadCount > 0 && dbNotifications.length > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        disabled={markingAll}
                                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-sx-text-subtle hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                                        title="Mark all as read"
                                    >
                                        {markingAll ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <CheckCheck className="h-3 w-3" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notification list */}
                        <div className="max-h-[320px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 animate-spin text-sx-text-subtle" />
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {notifications.map((notification) => (
                                        <motion.button
                                            key={notification.id}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={cn(
                                                "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]",
                                                !notification.read && "bg-sx-primary/[0.03]",
                                            )}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                                    typeColors[notification.type] || typeColors.system,
                                                )}
                                            >
                                                {typeIcons[notification.type] || typeIcons.system}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className={cn(
                                                            "truncate text-sm",
                                                            notification.read
                                                                ? "text-sx-text-secondary"
                                                                : "font-medium text-white",
                                                        )}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sx-primary-400" />
                                                    )}
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-sx-text-muted">
                                                    {notification.description}
                                                </p>
                                                <p className="mt-1 text-[11px] text-sx-text-subtle">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/8 px-4 py-2.5">
                            <button className="w-full text-center text-xs font-medium text-sx-primary-400 hover:text-sx-primary-300 transition-colors">
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
