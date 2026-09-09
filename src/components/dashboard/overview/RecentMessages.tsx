"use client";

/* -------------------------------------------------------------------------- */
/*                        RECENT MESSAGES                                     */
/*                                                                            */
/*  Message list with avatar, name, preview, time, and unread indicator.      */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { messagesData } from "./data";
import EmptyState from "./EmptyState";

export default function RecentMessages() {
    if (messagesData.length === 0) {
        return (
            <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title="No messages yet"
                description="Start a conversation to see messages here."
                action={{
                    label: "Send Message",
                    onClick: () => {},
                }}
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="divide-y divide-white/[0.04]">
                {messagesData.map((message, index) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.06,
                            ease: "easeOut",
                        }}
                        className={cn(
                            "group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] cursor-pointer",
                            message.unread && "bg-sx-primary/[0.02]"
                        )}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0 mt-0.5">
                            <Avatar
                                fallback={message.senderName}
                                src={message.senderAvatar}
                                size="sm"
                            />
                            {/* Online indicator (for demo) */}
                            {message.unread && (
                                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-sx-primary-400 border-2 border-[#0a0f1e]" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <p
                                    className={cn(
                                        "text-sm truncate pr-2",
                                        message.unread
                                            ? "font-semibold text-white"
                                            : "font-medium text-sx-text-secondary"
                                    )}
                                >
                                    {message.senderName}
                                </p>
                                <span className="shrink-0 text-[11px] text-sx-text-subtle">
                                    {message.relativeTime}
                                </span>
                            </div>
                            <p
                                className={cn(
                                    "text-xs line-clamp-2 leading-relaxed",
                                    message.unread
                                        ? "text-sx-text-muted"
                                        : "text-sx-text-subtle"
                                )}
                            >
                                {message.preview}
                            </p>
                        </div>

                        {/* Unread badge */}
                        {message.unread && (
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sx-primary-400" />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
