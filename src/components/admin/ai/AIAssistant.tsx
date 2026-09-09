"use client";

/* -------------------------------------------------------------------------- */
/*                         AI CHAT ASSISTANT                                  */
/*                                                                            */
/*  Sprint 4 — Module 5: Streaming chat interface for admin business          */
/*  intelligence. Multi-turn conversation with Gemini AI.                     */
/* -------------------------------------------------------------------------- */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Send,
    Loader2,
    Bot,
    User,
    Trash2,
    Sparkles,
    Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface ChatMessage {
    id: string;
    role: "user" | "model";
    content: string;
    timestamp: Date;
}

/* ── Suggested Prompts ─────────────────────────────────────────────────────── */

const SUGGESTED_PROMPTS = [
    {
        label: "Revenue Analysis",
        prompt: "Analyze our revenue trends and suggest strategies to increase monthly recurring revenue by 20%.",
        icon: "📊",
    },
    {
        label: "Client Retention",
        prompt: "What are the best practices for improving client retention rates in a digital agency?",
        icon: "🤝",
    },
    {
        label: "SEO Strategy",
        prompt: "Create a 90-day SEO strategy for a digital agency website targeting Indian businesses.",
        icon: "🔍",
    },
    {
        label: "Email Template",
        prompt: "Draft a professional follow-up email for a lead who showed interest in our web development services but hasn't responded in a week.",
        icon: "✉️",
    },
    {
        label: "Pricing Strategy",
        prompt: "Help me create a pricing strategy for our web development packages that balances competitiveness with profitability.",
        icon: "💰",
    },
    {
        label: "Team Productivity",
        prompt: "Suggest ways to improve team productivity and project delivery timelines in our agency.",
        icon: "⚡",
    },
];

export default function AIAssistant() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    /* ── Auto-scroll to bottom ────────────────────────────────────── */
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingContent, scrollToBottom]);

    /* ── Send message ─────────────────────────────────────────────── */
    const sendMessage = async (messageText?: string) => {
        const text = messageText || input.trim();
        if (!text || loading) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        setStreamingContent("");

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to get response");
            }

            /* ── Stream reading ──────────────────────────────────── */
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const text = decoder.decode(value, { stream: true });
                    const lines = text.split("\n");

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);
                            if (data === "[DONE]") continue;

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.text) {
                                    fullContent += parsed.text;
                                    setStreamingContent(fullContent);
                                }
                                if (parsed.error) {
                                    throw new Error(parsed.error);
                                }
                            } catch {
                                // Skip parse errors from partial JSON
                            }
                        }
                    }
                }
            }

            /* ── Add assistant message ───────────────────────────── */
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "model",
                content: fullContent,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setStreamingContent("");
        } catch (err) {
            const errorMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "model",
                content: `⚠️ Error: ${err instanceof Error ? err.message : "Something went wrong"}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setStreamingContent("");
        } finally {
            setLoading(false);
        }
    };

    /* ── Handle key press ─────────────────────────────────────────── */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    /* ── Clear chat ───────────────────────────────────────────────── */
    const handleClear = () => {
        setMessages([]);
        setStreamingContent("");
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            {/* ── Chat Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                        <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">
                            Sentrox AI Assistant
                        </p>
                        <p className="text-[10px] text-sx-text-subtle flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Powered by Gemini
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-sx-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear
                    </button>
                )}
            </div>

            {/* ── Messages Area ────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
                {/* Empty State */}
                {messages.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full gap-6"
                    >
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                                <Sparkles className="h-8 w-8 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                How can I help you today?
                            </h3>
                            <p className="mt-1 text-sm text-sx-text-muted max-w-md">
                                Ask me about business strategy, marketing, client management,
                                or anything related to your agency.
                            </p>
                        </div>

                        {/* Suggested prompts */}
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-2xl">
                            {SUGGESTED_PROMPTS.map((suggestion) => (
                                <button
                                    key={suggestion.label}
                                    onClick={() => sendMessage(suggestion.prompt)}
                                    className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all hover:bg-white/[0.04] hover:border-white/[0.10]"
                                >
                                    <span className="text-lg">{suggestion.icon}</span>
                                    <div>
                                        <p className="text-xs font-medium text-white group-hover:text-orange-300 transition-colors">
                                            {suggestion.label}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-sx-text-subtle line-clamp-2 leading-relaxed">
                                            {suggestion.prompt}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Messages */}
                <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "flex gap-3",
                                message.role === "user" ? "justify-end" : "justify-start",
                            )}
                        >
                            {message.role === "model" && (
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mt-0.5">
                                    <Bot className="h-3.5 w-3.5 text-white" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-3",
                                    message.role === "user"
                                        ? "bg-gradient-to-r from-violet-600/80 to-purple-600/80 text-white"
                                        : "bg-white/[0.04] border border-white/[0.06] text-sx-text-muted",
                                )}
                            >
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                </div>
                                <p className="mt-1.5 text-[10px] opacity-50">
                                    {message.timestamp.toLocaleTimeString("en-IN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>

                            {message.role === "user" && (
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] mt-0.5">
                                    <User className="h-3.5 w-3.5 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Streaming content */}
                {streamingContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mt-0.5">
                            <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="max-w-[80%] rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                            <div className="text-sm text-sx-text-muted whitespace-pre-wrap leading-relaxed">
                                {streamingContent}
                                <span className="inline-block h-4 w-0.5 bg-orange-400 animate-pulse ml-0.5" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Loading indicator */}
                {loading && !streamingContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mt-0.5">
                            <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ──────────────────────────────────────────── */}
            <div className="border-t border-white/[0.06] p-4">
                <div className="flex items-end gap-3">
                    <div className="relative flex-1">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about your business..."
                            rows={1}
                            className="w-full max-h-32 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white placeholder:text-sx-text-subtle focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all resize-none"
                            style={{
                                height: "auto",
                                minHeight: "44px",
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                            }}
                        />
                        <div className="absolute right-1.5 bottom-1.5 flex items-center gap-1">
                            <span className="text-[10px] text-sx-text-subtle mr-1">
                                <Lightbulb className="h-3 w-3 inline" /> Shift+Enter for newline
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all",
                            "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/20",
                            "hover:from-orange-500 hover:to-red-500 hover:shadow-orange-500/30",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                    >
                        {loading ? (
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                            <Send className="h-4.5 w-4.5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
