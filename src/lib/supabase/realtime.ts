/* -------------------------------------------------------------------------- */
/*                     SUPABASE REALTIME UTILITIES                            */
/*                                                                            */
/*  Sprint 4 — Module 3: Channel management, typed event handlers,           */
/*  presence tracking, and helper functions for real-time features.           */
/* -------------------------------------------------------------------------- */

import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

export interface RealtimeConfig<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Supabase table name to subscribe to */
    table: string;
    /** The schema (defaults to "public") */
    schema?: string;
    /** Optional column filter (e.g., "sender_id=eq.abc") */
    filter?: string;
    /** Which events to listen for */
    event?: RealtimeEvent;
    /** Callback when a matching change arrives */
    onInsert?: (payload: T) => void;
    onUpdate?: (payload: { old: T; new: T }) => void;
    onDelete?: (payload: T) => void;
    onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export interface PresenceState {
    userId: string;
    fullName: string;
    avatarUrl: string | null;
    status: "online" | "away" | "busy";
    lastSeen: string;
}

/* ── Notification Types ────────────────────────────────────────────────────── */

export type NotificationType =
    | "message"
    | "project_update"
    | "meeting"
    | "payment"
    | "invoice"
    | "file"
    | "system"
    | "lead";

export interface AppNotification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    body: string;
    link?: string;
    read: boolean;
    metadata?: Record<string, unknown>;
    created_at: string;
    [key: string]: unknown;
}

/* ── Channel naming ────────────────────────────────────────────────────────── */

export function getChannelName(table: string, filter?: string): string {
    const base = `realtime:${table}`;
    return filter ? `${base}:${filter}` : base;
}

export function getPresenceChannel(room: string): string {
    return `presence:${room}`;
}

export function getTypingChannel(conversationKey: string): string {
    return `typing:${conversationKey}`;
}

/* ── Subscription builder ──────────────────────────────────────────────────── */

/**
 * Subscribe a Supabase channel to Postgres changes for a given table.
 * Returns the channel so the caller can unsubscribe later.
 */
export function subscribeToTable<T extends Record<string, unknown>>(
    channel: RealtimeChannel,
    config: RealtimeConfig<T>,
): RealtimeChannel {
    const schema = config.schema || "public";
    const event = config.event || "*";

    const channelConfig: Record<string, string> = {
        event,
        schema,
        table: config.table,
    };

    if (config.filter) {
        channelConfig.filter = config.filter;
    }

    channel
        .on(
            "postgres_changes" as never,
            channelConfig as never,
            (payload: RealtimePostgresChangesPayload<T>) => {
                // Generic onChange handler
                config.onChange?.(payload);

                // Typed event handlers
                switch (payload.eventType) {
                    case "INSERT":
                        config.onInsert?.(payload.new as T);
                        break;
                    case "UPDATE":
                        config.onUpdate?.({
                            old: payload.old as T,
                            new: payload.new as T,
                        });
                        break;
                    case "DELETE":
                        config.onDelete?.(payload.old as T);
                        break;
                }
            },
        )
        .subscribe();

    return channel;
}

/* ── Presence helpers ──────────────────────────────────────────────────────── */

/**
 * Track a user's presence in a channel room.
 */
export function trackPresence(
    channel: RealtimeChannel,
    state: PresenceState,
): void {
    channel.track(state);
}

/**
 * Extract unique online users from a presence state map.
 */
export function getOnlineUsers(
    presenceState: Record<string, PresenceState[]>,
): PresenceState[] {
    const users = new Map<string, PresenceState>();

    for (const presences of Object.values(presenceState)) {
        for (const p of presences) {
            if (!users.has(p.userId)) {
                users.set(p.userId, p);
            }
        }
    }

    return Array.from(users.values());
}

/* ── Toast notification helper ─────────────────────────────────────────────── */

/**
 * Play a notification sound (optional, soft chime).
 */
export function playNotificationSound(): void {
    try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Autoplay blocked — ignore silently
        });
    } catch {
        // Audio not available
    }
}

/**
 * Show a browser notification (if permissions are granted).
 */
export async function showBrowserNotification(
    title: string,
    body: string,
    icon?: string,
): Promise<void> {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: icon || "/icon-192.png",
            badge: "/icon-192.png",
        });
    }
}
