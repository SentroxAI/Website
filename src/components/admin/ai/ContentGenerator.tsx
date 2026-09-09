"use client";

/* -------------------------------------------------------------------------- */
/*                       AI CONTENT GENERATOR                                 */
/*                                                                            */
/*  Sprint 4 — Module 5: Generate marketing content using AI.                 */
/*  Supports: Landing pages, Blog posts, Meta tags, FAQs,                     */
/*  Social media posts, and Email copy.                                       */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PenTool,
    Sparkles,
    Loader2,
    Copy,
    Check,
    Download,
    RefreshCw,
    Layout,
    FileText,
    Tags,
    HelpCircle,
    Share2,
    Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Content Type Options ──────────────────────────────────────────────────── */

const CONTENT_TYPES = [
    {
        id: "landing_page" as const,
        label: "Landing Page",
        icon: <Layout className="h-4 w-4" />,
        description: "High-converting page content",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        id: "blog_post" as const,
        label: "Blog Post",
        icon: <FileText className="h-4 w-4" />,
        description: "SEO-optimized articles",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        id: "meta_tags" as const,
        label: "Meta Tags",
        icon: <Tags className="h-4 w-4" />,
        description: "SEO metadata package",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        id: "faq" as const,
        label: "FAQ",
        icon: <HelpCircle className="h-4 w-4" />,
        description: "Question & answer pairs",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        id: "social_media" as const,
        label: "Social Media",
        icon: <Share2 className="h-4 w-4" />,
        description: "Multi-platform posts",
        gradient: "from-pink-500 to-rose-500",
    },
    {
        id: "email_copy" as const,
        label: "Email Copy",
        icon: <Mail className="h-4 w-4" />,
        description: "Marketing email content",
        gradient: "from-red-500 to-orange-500",
    },
];

type ContentType = (typeof CONTENT_TYPES)[number]["id"];

const TONE_OPTIONS = [
    "Professional",
    "Casual & Friendly",
    "Bold & Confident",
    "Technical",
    "Persuasive",
    "Educational",
    "Inspirational",
];

export default function ContentGenerator() {
    const [contentType, setContentType] = useState<ContentType>("blog_post");
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    const [tone, setTone] = useState("Professional");
    const [targetAudience, setTargetAudience] = useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    /* ── Generate content ─────────────────────────────────────────── */
    const handleGenerate = async () => {
        if (!topic) {
            setError("Please enter a topic.");
            return;
        }

        setLoading(true);
        setError("");
        setContent("");

        try {
            const res = await fetch("/api/ai/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: contentType,
                    topic,
                    keywords: keywords || undefined,
                    tone,
                    targetAudience: targetAudience || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate content");
            }

            setContent(data.content);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ── Copy/Download ────────────────────────────────────────────── */
    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${contentType}-${topic.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}-${new Date().toISOString().slice(0, 10)}.md`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const activeType = CONTENT_TYPES.find((t) => t.id === contentType)!;

    return (
        <div className="space-y-6">
            {/* ── Content Type Selector ────────────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-5 flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-violet-400" />
                    <h3 className="text-base font-semibold text-white">
                        Content Type
                    </h3>
                </div>

                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    {CONTENT_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setContentType(type.id)}
                            className={cn(
                                "group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all border",
                                contentType === type.id
                                    ? "bg-white/[0.06] border-white/[0.12] shadow-lg"
                                    : "bg-transparent border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08]",
                            )}
                        >
                            <div
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                                    contentType === type.id
                                        ? `bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                                        : "bg-white/[0.04] text-sx-text-muted group-hover:text-white",
                                )}
                            >
                                {type.icon}
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        "text-xs font-medium transition-colors",
                                        contentType === type.id
                                            ? "text-white"
                                            : "text-sx-text-muted group-hover:text-white",
                                    )}
                                >
                                    {type.label}
                                </p>
                                <p className="mt-0.5 text-[10px] text-sx-text-subtle leading-tight">
                                    {type.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Configuration Form ──────────────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-5 flex items-center gap-2">
                    {activeType.icon}
                    <h3 className="text-base font-semibold text-white">
                        {activeType.label} Configuration
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Topic */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 text-xs font-medium text-sx-text-muted">
                            Topic / Subject *
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={
                                contentType === "blog_post"
                                    ? "e.g., 10 Ways AI is Transforming Web Development in 2026"
                                    : contentType === "landing_page"
                                      ? "e.g., AI-Powered Website Builder for Small Businesses"
                                      : "e.g., Sentrox AI Digital Marketing Services"
                            }
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white placeholder:text-sx-text-subtle focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className="mb-1.5 text-xs font-medium text-sx-text-muted">
                            Target Keywords
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="e.g., AI web development, digital agency India"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white placeholder:text-sx-text-subtle focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Tone */}
                    <div>
                        <label className="mb-1.5 text-xs font-medium text-sx-text-muted">
                            Writing Tone
                        </label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
                        >
                            {TONE_OPTIONS.map((t) => (
                                <option key={t} value={t} className="bg-[#0a0f1c]">
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Target Audience */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 text-xs font-medium text-sx-text-muted">
                            Target Audience
                        </label>
                        <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g., Startup founders, small business owners, marketing managers"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white placeholder:text-sx-text-subtle focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-3">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className={cn(
                            "flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all",
                            `bg-gradient-to-r ${activeType.gradient} text-white shadow-lg`,
                            "hover:opacity-90 hover:shadow-xl",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Generate {activeType.label}
                            </>
                        )}
                    </button>

                    {content && (
                        <button
                            onClick={() => {
                                setContent("");
                                setTopic("");
                                setKeywords("");
                                setTargetAudience("");
                            }}
                            className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm text-sx-text-muted hover:text-white hover:border-white/[0.12] transition-all"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* ── Loading State ────────────────────────────────────────── */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8"
                    >
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className="relative">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl bg-gradient-to-br flex items-center justify-center",
                                    activeType.gradient,
                                )}>
                                    <PenTool className="h-6 w-6 text-white animate-pulse" />
                                </div>
                                <div className="absolute -inset-2 rounded-3xl bg-violet-500/20 animate-ping" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    Generating {activeType.label.toLowerCase()}...
                                </p>
                                <p className="mt-1 text-xs text-sx-text-muted">
                                    AI is creating optimized content for &ldquo;{topic}&rdquo;
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Generated Content ────────────────────────────────────── */}
            <AnimatePresence>
                {content && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                    >
                        {/* Output header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3.5">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-sm font-medium text-white">
                                    Generated {activeType.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-sx-text-muted hover:text-white hover:bg-white/[0.06] transition-all"
                                >
                                    {copied ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-sx-text-muted hover:text-white hover:bg-white/[0.06] transition-all"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    Download
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-sx-text-muted leading-relaxed">
                                {content}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
