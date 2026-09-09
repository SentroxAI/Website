"use client";

/* -------------------------------------------------------------------------- */
/*                         REALTIME HOOKS                                     */
/*                                                                            */
/*  Sprint 4 — Module 3: React hooks for Supabase Realtime.                  */
/*  - useRealtimeSubscription — generic table change listener                */
/*  - useRealtimeMessages — live message stream for conversations            */
/*  - useRealtimeNotifications — push notification listener                  */
/*  - usePresence — online user tracking                                     */
/*  - useTypingIndicator — typing status broadcast                           */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    subscribeToTable,
    getChannelName,
    getPresenceChannel,
    getOnlineUsers,
    playNotificationSound,
    type RealtimeConfig,
    type PresenceState,
    type AppNotification,
} from "@/lib/supabase/realtime";
import type { RealtimeChannel } from "@supabase/supabase-js";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*              useRealtimeSubscription — Generic table listener              */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Subscribe to real-time changes on a Supabase table.
 *
 * @example
 * ```tsx
 * useRealtimeSubscription({
 *   table: "messages",
 *   filter: `receiver_id=eq.${userId}`,
 *   onInsert: (msg) => setMessages(prev => [msg, ...prev]),
 * });
 * ```
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>(
    config: RealtimeConfig<T>,
    enabled: boolean = true,
) {
    const configRef = useRef(config);
    configRef.current = config;

    useEffect(() => {
        if (!enabled) return;

        const supabase = createClient();
        const channelName = getChannelName(config.table, config.filter);
        const channel = supabase.channel(channelName);

        subscribeToTable<T>(channel, {
            ...configRef.current,
            // Re-bind callbacks from ref so they stay fresh
            onInsert: (p) => configRef.current.onInsert?.(p),
            onUpdate: (p) => configRef.current.onUpdate?.(p),
            onDelete: (p) => configRef.current.onDelete?.(p),
            onChange: (p) => configRef.current.onChange?.(p),
        });

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.table, config.filter, config.event, enabled]);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                  useRealtimeMessages — Live message stream                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

export interface RealtimeMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    project_id: string | null;
    content: string;
    read: boolean;
    created_at: string;
    [key: string]: unknown;
}

/**
 * Subscribe to new messages for the current user.
 * Returns new incoming messages as they arrive.
 */
export function useRealtimeMessages(userId: string | undefined) {
    const [newMessages, setNewMessages] = useState<RealtimeMessage[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useRealtimeSubscription<RealtimeMessage>(
        {
            table: "messages",
            filter: userId ? `receiver_id=eq.${userId}` : undefined,
            onInsert: (message) => {
                setNewMessages((prev) => [message, ...prev]);
                if (!message.read) {
                    setUnreadCount((prev) => prev + 1);
                    playNotificationSound();
                }
            },
            onUpdate: ({ new: updated }) => {
                // Mark as read
                if (updated.read) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            },
        },
        !!userId,
    );

    const clearNew = useCallback(() => {
        setNewMessages([]);
    }, []);

    const resetUnread = useCallback(() => {
        setUnreadCount(0);
    }, []);

    return { newMessages, unreadCount, clearNew, resetUnread };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*             useRealtimeNotifications — Push notification listener          */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Subscribe to real-time notifications for the current user.
 */
export function useRealtimeNotifications(userId: string | undefined) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useRealtimeSubscription<AppNotification>(
        {
            table: "notifications",
            filter: userId ? `user_id=eq.${userId}` : undefined,
            onInsert: (notification) => {
                setNotifications((prev) => [notification, ...prev]);
                if (!notification.read) {
                    setUnreadCount((prev) => prev + 1);
                    playNotificationSound();
                }
            },
            onUpdate: ({ new: updated }) => {
                setNotifications((prev) =>
                    prev.map((n) => (n.id === updated.id ? updated : n)),
                );
                if (updated.read) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            },
            onDelete: (deleted) => {
                setNotifications((prev) =>
                    prev.filter((n) => n.id !== deleted.id),
                );
                if (!deleted.read) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            },
        },
        !!userId,
    );

    const markAsRead = useCallback(
        async (notificationId: string) => {
            const supabase = createClient();
            await supabase
                .from("notifications")
                // @ts-ignore — notifications table .update() type inference gap
                .update({ read: true })
                .eq("id", notificationId);
        },
        [],
    );

    const markAllRead = useCallback(async () => {
        if (!userId) return;
        const supabase = createClient();
        await supabase
            .from("notifications")
            // @ts-ignore — notifications table .update() type inference gap
            .update({ read: true })
            .eq("user_id", userId)
            .eq("read", false);
        setUnreadCount(0);
    }, [userId]);

    return { notifications, unreadCount, markAsRead, markAllRead };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      usePresence — Online user tracking                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Track online users in a room (e.g., "dashboard" or "project:xyz").
 */
export function usePresence(
    room: string,
    currentUser: {
        userId: string;
        fullName: string;
        avatarUrl: string | null;
    } | null,
) {
    const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        const supabase = createClient();
        const channelName = getPresenceChannel(room);
        const channel = supabase.channel(channelName, {
            config: { presence: { key: currentUser.userId } },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState<PresenceState>();
                setOnlineUsers(getOnlineUsers(state));
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                setOnlineUsers((prev) => {
                    const updated = [...prev];
                    for (const p of newPresences as unknown as PresenceState[]) {
                        if (!updated.some((u) => u.userId === p.userId)) {
                            updated.push(p);
                        }
                    }
                    return updated;
                });
            })
            .on("presence", { event: "leave" }, ({ leftPresences }) => {
                setOnlineUsers((prev) =>
                    prev.filter(
                        (u) =>
                            !(leftPresences as unknown as PresenceState[]).some(
                                (l) => l.userId === u.userId,
                            ),
                    ),
                );
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        userId: currentUser.userId,
                        fullName: currentUser.fullName,
                        avatarUrl: currentUser.avatarUrl,
                        status: "online",
                        lastSeen: new Date().toISOString(),
                    } satisfies PresenceState);
                }
            });

        channelRef.current = channel;

        return () => {
            channel.untrack();
            supabase.removeChannel(channel);
        };
    }, [room, currentUser?.userId, currentUser?.fullName, currentUser?.avatarUrl]);

    const isOnline = useCallback(
        (userId: string) => onlineUsers.some((u) => u.userId === userId),
        [onlineUsers],
    );

    return { onlineUsers, isOnline };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                   useTypingIndicator — Typing broadcast                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

interface TypingPayload {
    userId: string;
    fullName: string;
}

/**
 * Broadcast and listen for typing indicators in a conversation.
 */
export function useTypingIndicator(
    conversationKey: string | null,
    currentUser: { userId: string; fullName: string } | null,
) {
    const [typingUsers, setTypingUsers] = useState<TypingPayload[]>([]);
    const channelRef = useRef<RealtimeChannel | null>(null);
    const timeoutMapRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    useEffect(() => {
        if (!conversationKey || !currentUser) return;

        const supabase = createClient();
        const channel = supabase.channel(`typing:${conversationKey}`);

        channel
            .on("broadcast", { event: "typing" }, ({ payload }) => {
                const user = payload as TypingPayload;
                if (user.userId === currentUser.userId) return;

                // Add to typing list
                setTypingUsers((prev) => {
                    if (prev.some((u) => u.userId === user.userId)) return prev;
                    return [...prev, user];
                });

                // Clear after 3 seconds
                const existingTimeout = timeoutMapRef.current.get(user.userId);
                if (existingTimeout) clearTimeout(existingTimeout);

                const timeout = setTimeout(() => {
                    setTypingUsers((prev) =>
                        prev.filter((u) => u.userId !== user.userId),
                    );
                    timeoutMapRef.current.delete(user.userId);
                }, 3000);

                timeoutMapRef.current.set(user.userId, timeout);
            })
            .subscribe();

        channelRef.current = channel;

        return () => {
            // Clear all timeouts
            for (const timeout of timeoutMapRef.current.values()) {
                clearTimeout(timeout);
            }
            timeoutMapRef.current.clear();
            supabase.removeChannel(channel);
        };
    }, [conversationKey, currentUser?.userId]);

    const sendTyping = useCallback(() => {
        if (!channelRef.current || !currentUser) return;

        channelRef.current.send({
            type: "broadcast",
            event: "typing",
            payload: {
                userId: currentUser.userId,
                fullName: currentUser.fullName,
            },
        });
    }, [currentUser]);

    return { typingUsers, sendTyping };
}
