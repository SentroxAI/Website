"use client";

/* -------------------------------------------------------------------------- */
/*                          MESSAGE THREAD                                    */
/*                                                                            */
/*  Right panel: message bubbles for the active conversation.                 */
/*  Shows contact header, scrollable messages, and input composer.            */
/* -------------------------------------------------------------------------- */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Paperclip,
    Phone,
    Video,
    MoreHorizontal,
    FileText,
    Download,
    SmilePlus,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Message } from "./data";

/* ── Empty state ───────────────────────────────────────────────────────────── */

function MessageEmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] mb-4">
                <MessageSquare className="h-7 w-7 text-sx-text-subtle" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
                Select a conversation
            </h3>
            <p className="text-sm text-sx-text-muted max-xs">
                Choose a conversation from the list to start messaging.
            </p>
        </div>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

interface MessageThreadProps {
    conversation: Conversation | null;
}

export default function MessageThread({ conversation }: MessageThreadProps) {
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState("");
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sync local messages when conversation changes
    useEffect(() => {
        if (conversation) {
            setLocalMessages(conversation.messages);
        }
    }, [conversation?.id]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [localMessages.length]);

    if (!conversation) {
        return <MessageEmptyState />;
    }

    const { contact, projectName } = conversation;

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const text = inputValue.trim();
        setInputValue("");

        // Optimistic local update
        const newMsg: Message = {
            id: `local-${Date.now()}`,
            senderId: "me",
            content: text,
            timestamp: new Date().toISOString(),
            relativeTime: "Just now",
            read: false,
            type: "text",
        };
        setLocalMessages((prev) => [...prev, newMsg]);

        // Try to insert into Supabase
        if (user) {
            try {
                const supabase = createClient();
                await (supabase.from("messages") as any).insert({
                    sender_id: user.id,
                    receiver_id: contact.id,
                    content: text,
                    read: false,
                });
            } catch {
                // Silently fail — message is shown locally already
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* ── Thread header ───────────────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar fallback={contact.name} src={contact.avatar} size="sm" />
                        {contact.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0f1e]" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            {contact.name}
                        </h3>
                        <p className="text-[11px] text-sx-text-muted">
                            {contact.online ? (
                                <span className="text-emerald-400">Online</span>
                            ) : (
                                contact.role
                            )}
                            {projectName && (
                                <span className="text-sx-text-subtle"> · {projectName}</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                        <Phone className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                        <Video className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* ── Messages area ────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                {localMessages.map((msg, index) => {
                    const isMe = msg.senderId === "me";
                    const showAvatar =
                        !isMe &&
                        (index === 0 || localMessages[index - 1].senderId !== msg.senderId);

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isMe={isMe}
                            showAvatar={showAvatar}
                            contactName={contact.name}
                            contactAvatar={contact.avatar}
                            index={index}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Composer ─────────────────────────────────────────────── */}
            <div className="shrink-0 border-t border-white/[0.06] px-4 py-3">
                <div className="flex items-end gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 focus-within:border-sx-primary/30 focus-within:bg-white/[0.05] transition-colors">
                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors mb-0.5">
                        <Paperclip className="h-4 w-4" />
                    </button>

                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message…"
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-sx-text-subtle outline-none max-h-24 py-1.5"
                    />

                    <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors mb-0.5">
                        <SmilePlus className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all mb-0.5",
                            inputValue.trim()
                                ? "bg-sx-primary-600 text-white hover:bg-sx-primary-500 shadow-md shadow-sx-primary/20"
                                : "text-sx-text-subtle cursor-not-allowed"
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                <p className="mt-1.5 text-[10px] text-sx-text-subtle text-center">
                    Press <kbd className="rounded border border-white/10 bg-white/5 px-1 py-px text-[9px]">Enter</kbd> to send · <kbd className="rounded border border-white/10 bg-white/5 px-1 py-px text-[9px]">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}

/* ── Message bubble ────────────────────────────────────────────────────────── */

function MessageBubble({
    message,
    isMe,
    showAvatar,
    contactName,
    contactAvatar,
    index,
}: {
    message: Message;
    isMe: boolean;
    showAvatar: boolean;
    contactName: string;
    contactAvatar?: string;
    index: number;
}) {
    // System messages
    if (message.type === "system") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="flex justify-center py-2"
            >
                <p className="text-[11px] text-sx-text-subtle bg-white/[0.03] rounded-full px-3 py-1 border border-white/[0.04]">
                    {message.content}
                </p>
            </motion.div>
        );
    }

    // File messages
    if (message.type === "file") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={cn("flex gap-2 py-1", isMe ? "justify-end" : "justify-start")}
            >
                {!isMe && showAvatar && (
                    <Avatar fallback={contactName} src={contactAvatar} size="xs" className="mt-1" />
                )}
                {!isMe && !showAvatar && <div className="w-6" />}

                <div
                    className={cn(
                        "max-w-xs rounded-2xl px-3.5 py-2.5 border",
                        isMe
                            ? "bg-sx-primary-600/20 border-sx-primary/20"
                            : "bg-white/[0.04] border-white/[0.06]"
                    )}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                            <FileText className="h-4 w-4 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                                {message.fileName}
                            </p>
                            <p className="text-[10px] text-sx-text-muted">
                                {message.fileSize}
                            </p>
                        </div>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                            <Download className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <p className="mt-1.5 text-[10px] text-sx-text-subtle text-right">
                        {message.relativeTime}
                    </p>
                </div>
            </motion.div>
        );
    }

    // Text messages
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={cn("flex gap-2 py-1", isMe ? "justify-end" : "justify-start")}
        >
            {!isMe && showAvatar && (
                <Avatar fallback={contactName} src={contactAvatar} size="xs" className="mt-1" />
            )}
            {!isMe && !showAvatar && <div className="w-6" />}

            <div
                className={cn(
                    "max-w-xs rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    isMe
                        ? "bg-sx-primary-600 text-white rounded-br-md"
                        : "bg-white/[0.06] text-sx-text-secondary rounded-bl-md"
                )}
            >
                <p>{message.content}</p>
                <p
                    className={cn(
                        "mt-1 text-[10px] text-right",
                        isMe ? "text-white/50" : "text-sx-text-subtle"
                    )}
                >
                    {message.relativeTime}
                </p>
            </div>
        </motion.div>
    );
}
