"use client";

/* -------------------------------------------------------------------------- */
/*                      AI PROPOSAL GENERATOR                                 */
/*                                                                            */
/*  Sprint 4 — Module 5: Takes lead data and generates a professional         */
/*  project proposal using Gemini AI. Supports manual input or                */
/*  fetching existing leads from the database.                                */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Sparkles,
    Loader2,
    Copy,
    Check,
    Download,
    RefreshCw,
    User,
    Building2,
    Briefcase,
    IndianRupee,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Service options ───────────────────────────────────────────────────────── */

const SERVICES = [
    "Website Design & Development",
    "E-commerce Development",
    "Mobile App Development",
    "AI/ML Integration",
    "Brand Identity & Design",
    "SEO & Digital Marketing",
    "Social Media Marketing",
    "UI/UX Design",
    "Cloud & DevOps",
    "Custom Software Development",
];

const BUDGETS = [
    "₹25,000 - ₹50,000",
    "₹50,000 - ₹1,00,000",
    "₹1,00,000 - ₹2,50,000",
    "₹2,50,000 - ₹5,00,000",
    "₹5,00,000 - ₹10,00,000",
    "₹10,00,000+",
];

interface FormData {
    name: string;
    company: string;
    service: string;
    budget: string;
    message: string;
}

export default function ProposalGenerator() {
    const [form, setForm] = useState<FormData>({
        name: "",
        company: "",
        service: "",
        budget: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [proposal, setProposal] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [copied, setCopied] = useState(false);

    /* ── Generate proposal ────────────────────────────────────────── */
    const handleGenerate = async () => {
        if (!form.name || !form.service) {
            setError("Client name and service are required.");
            return;
        }

        setLoading(true);
        setError("");
        setProposal("");

        try {
            const res = await fetch("/api/ai/proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate proposal");
            }

            setProposal(data.proposal);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ── Copy to clipboard ────────────────────────────────────────── */
    const handleCopy = async () => {
        await navigator.clipboard.writeText(proposal);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /* ── Download as markdown ─────────────────────────────────────── */
    const handleDownload = () => {
        const blob = new Blob([proposal], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `proposal-${form.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.md`;
        link.click();
        URL.revokeObjectURL(url);
    };

    /* ── Reset ────────────────────────────────────────────────────── */
    const handleReset = () => {
        setForm({ name: "", company: "", service: "", budget: "", message: "" });
        setProposal("");
        setError("");
    };

    return (
        <div className="space-y-6">
            {/* ── Input Form ────────────────────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-5 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <h3 className="text-base font-semibold text-white">
                        Lead Information
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Name */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sx-text-muted">
                            <User className="h-3.5 w-3.5" />
                            Client Name *
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white placeholder:text-sx-text-subtle focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sx-text-muted">
                            <Building2 className="h-3.5 w-3.5" />
                            Company
                        </label>
                        <input
                            type="text"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            placeholder="Acme Corp"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white placeholder:text-sx-text-subtle focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Service */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sx-text-muted">
                            <Briefcase className="h-3.5 w-3.5" />
                            Service Requested *
                        </label>
                        <select
                            value={form.service}
                            onChange={(e) => setForm({ ...form, service: e.target.value })}
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-[#0a0f1c]">Select a service</option>
                            {SERVICES.map((s) => (
                                <option key={s} value={s} className="bg-[#0a0f1c]">
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sx-text-muted">
                            <IndianRupee className="h-3.5 w-3.5" />
                            Budget Range
                        </label>
                        <select
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-[#0a0f1c]">Select budget range</option>
                            {BUDGETS.map((b) => (
                                <option key={b} value={b} className="bg-[#0a0f1c]">
                                    {b}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sx-text-muted">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Client Requirements
                        </label>
                        <textarea
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Describe the project requirements, goals, and any specific features needed..."
                            rows={4}
                            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-sx-text-subtle focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
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
                        disabled={loading || !form.name || !form.service}
                        className={cn(
                            "flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-medium transition-all",
                            "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20",
                            "hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/30",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-violet-600 disabled:hover:to-purple-600",
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
                                Generate Proposal
                            </>
                        )}
                    </button>

                    {proposal && (
                        <button
                            onClick={handleReset}
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
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-white animate-pulse" />
                                </div>
                                <div className="absolute -inset-2 rounded-3xl bg-violet-500/20 animate-ping" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    Generating your proposal...
                                </p>
                                <p className="mt-1 text-xs text-sx-text-muted">
                                    AI is crafting a personalized proposal based on the lead data
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Proposal Output ──────────────────────────────────────── */}
            <AnimatePresence>
                {proposal && !loading && (
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
                                    Generated Proposal
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

                        {/* Proposal content (rendered as pre-formatted text for now) */}
                        <div className="p-6">
                            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-sx-text-muted leading-relaxed">
                                {proposal}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
