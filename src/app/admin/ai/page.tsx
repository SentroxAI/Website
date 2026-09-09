"use client";

/* -------------------------------------------------------------------------- */
/*                         ADMIN AI TOOLS HUB                                 */
/*                                                                            */
/*  Sprint 4 — Module 5: Central hub for all AI-powered features.             */
/*  Tabs: Proposal Generator · Website Auditor · Content Generator · Chat     */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Brain,
    FileText,
    Globe,
    PenTool,
    MessageSquare,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminContainer from "@/components/admin/AdminContainer";
import {
    DynamicProposalGenerator as ProposalGenerator,
    DynamicWebsiteAuditor as WebsiteAuditor,
    DynamicContentGenerator as ContentGenerator,
    DynamicAIAssistant as AIAssistant,
} from "@/lib/dynamic-imports";

/* ── Tab Configuration ─────────────────────────────────────────────────────── */

const tabs = [
    {
        id: "proposals",
        label: "Proposals",
        icon: <FileText className="h-4 w-4" />,
        description: "Generate proposals from leads",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        id: "audit",
        label: "Website Audit",
        icon: <Globe className="h-4 w-4" />,
        description: "SEO & performance analysis",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        id: "content",
        label: "Content",
        icon: <PenTool className="h-4 w-4" />,
        description: "Generate marketing content",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        id: "chat",
        label: "AI Chat",
        icon: <MessageSquare className="h-4 w-4" />,
        description: "Business intelligence assistant",
        gradient: "from-orange-500 to-red-500",
    },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminAIPage() {
    const [activeTab, setActiveTab] = useState<TabId>("proposals");

    return (
        <AdminContainer>
            {/* ── Header ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                        <Brain className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            AI Tools
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                                <Sparkles className="h-3 w-3" />
                                Powered by Gemini
                            </span>
                        </h1>
                        <p className="text-sm text-sx-text-muted">
                            AI-powered tools to supercharge your workflow
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ── Tab Navigation ───────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-white/[0.08] text-white shadow-lg border border-white/[0.08]"
                                : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white border border-transparent",
                        )}
                    >
                        <span
                            className={cn(
                                "transition-colors",
                                activeTab === tab.id
                                    ? "text-violet-400"
                                    : "text-sx-text-subtle group-hover:text-sx-text-muted",
                            )}
                        >
                            {tab.icon}
                        </span>
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="ai-tab-indicator"
                                className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                transition={{
                                    type: "spring",
                                    bounce: 0.2,
                                    duration: 0.5,
                                }}
                            />
                        )}
                    </button>
                ))}
            </motion.div>

            {/* ── Tab Content ──────────────────────────────────────────── */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === "proposals" && <ProposalGenerator />}
                {activeTab === "audit" && <WebsiteAuditor />}
                {activeTab === "content" && <ContentGenerator />}
                {activeTab === "chat" && <AIAssistant />}
            </motion.div>
        </AdminContainer>
    );
}
