"use client";

/* -------------------------------------------------------------------------- */
/*                          FILE FILTERS                                      */
/*                                                                            */
/*  Filter bar: type tabs, project filter, search, view toggle.               */
/* -------------------------------------------------------------------------- */

import { Search, X, LayoutGrid, List, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FileType, ViewMode } from "./data";

const typeTabs: { value: FileType | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pdf", label: "PDF" },
    { value: "image", label: "Images" },
    { value: "video", label: "Video" },
    { value: "document", label: "Docs" },
    { value: "figma", label: "Design" },
    { value: "spreadsheet", label: "Sheets" },
];

interface FileFiltersProps {
    activeType: FileType | "all";
    onTypeChange: (type: FileType | "all") => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    projectFilter: string;
    onProjectFilterChange: (project: string) => void;
    projects: string[];
    counts: Record<string, number>;
}

export default function FileFilters({
    activeType,
    onTypeChange,
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
    projectFilter,
    onProjectFilterChange,
    projects,
    counts,
}: FileFiltersProps) {
    return (
        <div className="space-y-3">
            {/* Top row: type tabs + view toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Type tabs */}
                <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-white/[0.03] p-1 border border-white/[0.06]">
                    {typeTabs.map((tab) => {
                        const isActive = activeType === tab.value;
                        const count = tab.value === "all" ? counts.all : (counts[tab.value] || 0);

                        return (
                            <button
                                key={tab.value}
                                onClick={() => onTypeChange(tab.value)}
                                className={cn(
                                    "relative flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                                    isActive ? "text-white" : "text-sx-text-muted hover:text-sx-text-secondary"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="file-filter-tab"
                                        className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative">{tab.label}</span>
                                {count > 0 && (
                                    <span className={cn(
                                        "relative rounded-full px-1.5 py-px text-[10px] tabular-nums",
                                        isActive ? "bg-sx-primary/20 text-sx-primary-400" : "bg-white/5 text-sx-text-subtle"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1 border border-white/[0.06]">
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                            viewMode === "grid" ? "bg-white/[0.08] text-white" : "text-sx-text-subtle hover:text-white"
                        )}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                            viewMode === "list" ? "bg-white/[0.08] text-white" : "text-sx-text-subtle hover:text-white"
                        )}
                    >
                        <List className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Bottom row: search + project filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        placeholder="Search files…"
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

                {/* Project filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sx-text-subtle pointer-events-none" />
                    <select
                        value={projectFilter}
                        onChange={(e) => onProjectFilterChange(e.target.value)}
                        className="appearance-none rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-8 text-sm text-sx-text-secondary outline-none transition-colors focus:border-sx-primary/30 cursor-pointer min-w-[160px]"
                    >
                        <option value="">All projects</option>
                        {projects.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
