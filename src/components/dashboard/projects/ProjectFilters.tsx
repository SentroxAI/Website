"use client";

/* -------------------------------------------------------------------------- */
/*                        PROJECT FILTERS                                     */
/*                                                                            */
/*  Filter bar: status tabs + search input.                                   */
/* -------------------------------------------------------------------------- */

import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "./data";

const statusTabs: { value: ProjectStatus | "all"; label: string; count?: number }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

interface ProjectFiltersProps {
    activeStatus: ProjectStatus | "all";
    onStatusChange: (status: ProjectStatus | "all") => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    counts: Record<string, number>;
}

export default function ProjectFilters({
    activeStatus,
    onStatusChange,
    searchQuery,
    onSearchChange,
    counts,
}: ProjectFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            {/* Status tabs */}
            <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
                {statusTabs.map((tab) => {
                    const isActive = activeStatus === tab.value;
                    const count = tab.value === "all" ? counts.all : (counts[tab.value] || 0);

                    return (
                        <button
                            key={tab.value}
                            onClick={() => onStatusChange(tab.value)}
                            className={cn(
                                "relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                isActive
                                    ? "text-white"
                                    : "text-sx-text-muted hover:text-sx-text-secondary"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="project-filter-tab"
                                    className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative">{tab.label}</span>
                            {count > 0 && (
                                <span
                                    className={cn(
                                        "relative rounded-full px-1.5 py-px text-[10px] tabular-nums",
                                        isActive
                                            ? "bg-sx-primary/20 text-sx-primary-400"
                                            : "bg-white/5 text-sx-text-subtle"
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                <input
                    type="text"
                    placeholder="Search projects…"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-8 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30 focus:bg-white/[0.05]"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sx-text-subtle hover:text-white transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
