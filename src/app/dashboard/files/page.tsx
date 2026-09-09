"use client";

/* -------------------------------------------------------------------------- */
/*                           FILES PAGE                                       */
/*                                                                            */
/*  Sprint 4 — Module 2: Full file management with Supabase Storage.         */
/*  Combines the FileManager (real storage) with local data fallback.        */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, HardDrive, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import FileManager from "@/components/dashboard/files/FileManager";
import StorageSummary from "@/components/dashboard/files/StorageSummary";

type TabView = "storage" | "summary";

export default function FilesPage() {
    const [activeTab, setActiveTab] = useState<TabView>("storage");

    const tabs: { id: TabView; label: string; icon: React.ReactNode }[] = [
        { id: "storage", label: "Storage", icon: <Database className="h-3.5 w-3.5" /> },
        { id: "summary", label: "Overview", icon: <HardDrive className="h-3.5 w-3.5" /> },
    ];

    return (
        <DashboardContainer>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
            >
                <div>
                    <h1 className="text-xl font-bold text-white md:text-2xl">
                        Files
                    </h1>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        Manage files across all storage buckets.
                    </p>
                </div>

                {/* Tab switcher */}
                <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                activeTab === tab.id
                                    ? "text-white"
                                    : "text-sx-text-muted hover:text-sx-text-secondary",
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="files-tab"
                                    className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative flex items-center gap-1.5">
                                {tab.icon}
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Content */}
            {activeTab === "summary" ? (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <StorageSummary />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <FileManager defaultBucket="client-files" />
                </motion.div>
            )}
        </DashboardContainer>
    );
}
