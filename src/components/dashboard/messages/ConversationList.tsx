"use client";

/* -------------------------------------------------------------------------- */
/*                        CONVERSATION LIST                                   */
/*                                                                            */
/*  Left panel: list of conversations with search, pinned section,            */
/*  unread badges, online indicators, and active selection.                   */
/* -------------------------------------------------------------------------- */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Pin, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { conversations, type Conversation } from "./data";

interface ConversationListProps {
    activeId: string | null;
    onSelect: (id: string) => void;
}

export default function ConversationList({ activeId, onSelect }: ConversationListProps) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return conversations;
        const q = search.toLowerCase();
        return conversations.filter(
            (c) =>
                c.contact.name.toLowerCase().includes(q) ||
                c.lastMessage.toLowerCase().includes(q) ||
                c.projectName?.toLowerCase().includes(q)
        );
    }, [search]);

    const pinned = filtered.filter((c) => c.pinned);
    const regular = filtered.filter((c) => !c.pinned);

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="shrink-0 border-b border-white/[0.06] px-4 py-4">
                <h2 className="text-base font-semibold text-white mb-3">
                    Messages
                </h2>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        placeholder="Search conversations…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-8 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30 focus:bg-white/[0.05]"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sx-text-subtle hover:text-white transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                        <MessageSquare className="h-8 w-8 text-sx-text-subtle mb-2" />
                        <p className="text-sm text-sx-text-muted">No conversations found</p>
                    </div>
                ) : (
                    <>
                        {/* Pinned section */}
                        {pinned.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
                                    <Pin className="h-3 w-3 text-sx-text-subtle" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Pinned
                                    </span>
                                </div>
                                {pinned.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={activeId === conv.id}
                                        onSelect={onSelect}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Regular conversations */}
                        {regular.length > 0 && (
                            <div>
                                {pinned.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Recent
                                        </span>
                                    </div>
                                )}
                                {regular.map((conv) => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isActive={activeId === conv.id}
                                        onSelect={onSelect}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* ── Conversation item ─────────────────────────────────────────────────────── */

function ConversationItem({
    conversation,
    isActive,
    onSelect,
}: {
    conversation: Conversation;
    isActive: boolean;
    onSelect: (id: string) => void;
}) {
    const { contact, lastMessage, relativeTime, unreadCount, projectName } = conversation;

    return (
        <button
            onClick={() => onSelect(conversation.id)}
            className={cn(
                "relative flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                isActive
                    ? "bg-sx-primary/[0.08] border-l-2 border-sx-primary-400"
                    : "hover:bg-white/[0.03] border-l-2 border-transparent"
            )}
        >
            {/* Avatar + online */}
            <div className="relative shrink-0 mt-0.5">
                <Avatar fallback={contact.name} src={contact.avatar} size="sm" />
                {contact.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0f1e]" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span
                        className={cn(
                            "text-sm truncate pr-2",
                            unreadCount > 0 ? "font-semibold text-white" : "font-medium text-sx-text-secondary"
                        )}
                    >
                        {contact.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-sx-text-subtle">
                        {relativeTime}
                    </span>
                </div>

                {projectName && (
                    <p className="text-[10px] text-sx-primary-400 font-medium mb-0.5 truncate">
                        {projectName}
                    </p>
                )}

                <div className="flex items-center gap-2">
                    <p
                        className={cn(
                            "text-xs line-clamp-1 flex-1",
                            unreadCount > 0 ? "text-sx-text-muted" : "text-sx-text-subtle"
                        )}
                    >
                        {lastMessage}
                    </p>

                    {unreadCount > 0 && (
                        <span className="shrink-0 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-sx-primary-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}
