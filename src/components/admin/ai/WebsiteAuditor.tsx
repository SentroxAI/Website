"use client";

/* -------------------------------------------------------------------------- */
/*                       AI WEBSITE AUDITOR                                   */
/*                                                                            */
/*  Sprint 4 — Module 5: Takes a URL and performs AI-powered analysis         */
/*  covering SEO, Performance, Accessibility, Security, and Content Quality.  */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe,
    Sparkles,
    Loader2,
    Copy,
    Check,
    Download,
    ExternalLink,
    Search,
    Shield,
    Zap,
    Eye,
    FileText,
    RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Audit Category Cards ──────────────────────────────────────────────────── */

const AUDIT_CATEGORIES = [
    {
        icon: <Search className="h-5 w-5" />,
        label: "SEO",
        description: "Search engine optimization",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
    },
    {
        icon: <Zap className="h-5 w-5" />,
        label: "Performance",
        description: "Speed & Core Web Vitals",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        icon: <Eye className="h-5 w-5" />,
        label: "Accessibility",
        description: "WCAG compliance",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
    },
    {
        icon: <Shield className="h-5 w-5" />,
        label: "Security",
        description: "Headers & best practices",
        color: "text-red-400",
        bg: "bg-red-500/10",
    },
    {
        icon: <FileText className="h-5 w-5" />,
        label: "Content",
        description: "Quality & readability",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
    },
];

export default function WebsiteAuditor() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [auditUrl, setAuditUrl] = useState("");

    /* ── Run audit ────────────────────────────────────────────────── */
    const handleAudit = async () => {
        if (!url) {
            setError("Please enter a URL.");
            return;
        }

        // Ensure URL has protocol
        let fullUrl = url;
        if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
            fullUrl = `https://${fullUrl}`;
        }

        try {
            new URL(fullUrl);
        } catch {
            setError("Please enter a valid URL.");
            return;
        }

        setLoading(true);
        setError("");
        setReport("");
        setAuditUrl(fullUrl);

        try {
            const res = await fetch("/api/ai/audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: fullUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate audit");
            }

            setReport(data.report);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ── Copy/Download ────────────────────────────────────────────── */
    const handleCopy = async () => {
        await navigator.clipboard.writeText(report);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([report], { type: "text/markdown" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        const domain = new URL(auditUrl).hostname;
        link.download = `audit-${domain}-${new Date().toISOString().slice(0, 10)}.md`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <div className="space-y-6">
            {/* ── URL Input ───────────────────────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-5 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-base font-semibold text-white">
                        Website URL
                    </h3>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <ExternalLink className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                            placeholder="example.com or https://example.com"
                            className="h-11 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-3 text-sm text-white placeholder:text-sx-text-subtle focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleAudit}
                        disabled={loading || !url}
                        className={cn(
                            "flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-medium transition-all",
                            "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20",
                            "hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/30",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Auditing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Run Audit
                            </>
                        )}
                    </button>
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
            </div>

            {/* ── Audit Categories (preview cards) ────────────────────── */}
            {!report && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
                >
                    {AUDIT_CATEGORIES.map((cat, i) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * i }}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center"
                        >
                            <div
                                className={cn(
                                    "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                                    cat.bg,
                                    cat.color,
                                )}
                            >
                                {cat.icon}
                            </div>
                            <p className="text-sm font-medium text-white">{cat.label}</p>
                            <p className="mt-0.5 text-xs text-sx-text-subtle">
                                {cat.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ── Loading State ───────────────────────────────────────── */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8"
                    >
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className="relative">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Globe className="h-6 w-6 text-white animate-pulse" />
                                </div>
                                <div className="absolute -inset-2 rounded-3xl bg-emerald-500/20 animate-ping" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    Analyzing {auditUrl}...
                                </p>
                                <p className="mt-1 text-xs text-sx-text-muted">
                                    AI is performing SEO, performance, accessibility, security &amp; content analysis
                                </p>
                            </div>

                            {/* Animated progress indicators */}
                            <div className="mt-4 grid w-full max-w-md grid-cols-5 gap-2">
                                {AUDIT_CATEGORIES.map((cat, i) => (
                                    <motion.div
                                        key={cat.label}
                                        initial={{ opacity: 0.3 }}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.3,
                                            repeat: Infinity,
                                        }}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <div className={cn("h-1.5 w-full rounded-full", cat.bg)} />
                                        <span className="text-[10px] text-sx-text-subtle">
                                            {cat.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Audit Report ─────────────────────────────────────────── */}
            <AnimatePresence>
                {report && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                    >
                        {/* Report header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3.5">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-sm font-medium text-white">
                                    Audit Report — {auditUrl}
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
                                <button
                                    onClick={() => { setReport(""); setUrl(""); }}
                                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs text-sx-text-muted hover:text-white hover:bg-white/[0.06] transition-all"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    New Audit
                                </button>
                            </div>
                        </div>

                        {/* Report content */}
                        <div className="p-6">
                            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-sx-text-muted leading-relaxed">
                                {report}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
