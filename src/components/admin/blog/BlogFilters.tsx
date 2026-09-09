"use client";

/* -------------------------------------------------------------------------- */
/*                        BLOG FILTERS                                        */
/*                                                                            */
/*  Horizontal filter bar: search, status pills, tag dropdown, sort.         */
/* -------------------------------------------------------------------------- */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogFilters as BlogFiltersType } from "@/app/actions/blog";

interface BlogFiltersProps {
    filters: BlogFiltersType;
    onFiltersChange: (filters: BlogFiltersType) => void;
    totalResults: number;
    availableTags: string[];
}

const statusOptions: { value: "all" | "published" | "draft"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
];

const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "title_asc", label: "Title A → Z" },
    { value: "title_desc", label: "Title Z → A" },
    { value: "recently_published", label: "Recently published" },
];

export default function BlogFilters({
    filters,
    onFiltersChange,
    totalResults,
    availableTags,
}: BlogFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const tagRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchValue(value);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onFiltersChange({ ...filters, search: value });
            }, 300);
        },
        [filters, onFiltersChange],
    );

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
                setShowTagDropdown(false);
            }
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeFilterCount = [
        filters.status && filters.status !== "all",
        filters.tag && filters.tag !== "all",
        filters.search,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSearchValue("");
        onFiltersChange({ status: "all", search: "", tag: "all", sort: "newest" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by title, slug, or author..."
                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-9 pr-9 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                    />
                    {searchValue && (
                        <button
                            onClick={() => handleSearchChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sx-text-subtle hover:text-white transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Tag dropdown */}
                {availableTags.length > 0 && (
                    <div ref={tagRef} className="relative">
                        <button
                            onClick={() => {
                                setShowTagDropdown(!showTagDropdown);
                                setShowSortDropdown(false);
                            }}
                            className={cn(
                                "flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]",
                                filters.tag && filters.tag !== "all"
                                    ? "text-white"
                                    : "text-sx-text-muted",
                            )}
                        >
                            <Tags className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline max-w-[120px] truncate">
                                {filters.tag && filters.tag !== "all" ? filters.tag : "All Tags"}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {showTagDropdown && (
                            <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[180px] max-h-[280px] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                                <button
                                    onClick={() => {
                                        onFiltersChange({ ...filters, tag: "all" });
                                        setShowTagDropdown(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center rounded-lg px-3 py-2 text-xs transition-colors",
                                        (!filters.tag || filters.tag === "all")
                                            ? "bg-white/[0.06] text-white"
                                            : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    All Tags
                                </button>
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            onFiltersChange({ ...filters, tag });
                                            setShowTagDropdown(false);
                                        }}
                                        className={cn(
                                            "flex w-full items-center rounded-lg px-3 py-2 text-xs transition-colors",
                                            filters.tag === tag
                                                ? "bg-white/[0.06] text-white"
                                                : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                        )}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Sort dropdown */}
                <div ref={sortRef} className="relative">
                    <button
                        onClick={() => {
                            setShowSortDropdown(!showSortDropdown);
                            setShowTagDropdown(false);
                        }}
                        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-sx-text-muted transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                    >
                        <span className="hidden sm:inline">
                            {sortOptions.find((o) => o.value === filters.sort)?.label || "Newest first"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    {showSortDropdown && (
                        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[180px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onFiltersChange({ ...filters, sort: opt.value as BlogFiltersType["sort"] });
                                        setShowSortDropdown(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center rounded-lg px-3 py-2 text-xs transition-colors",
                                        (filters.sort || "newest") === opt.value
                                            ? "bg-white/[0.06] text-white"
                                            : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Status pills */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {statusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onFiltersChange({ ...filters, status: opt.value })}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                (filters.status || "all") === opt.value
                                    ? "bg-white/[0.1] text-white shadow-sm"
                                    : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            <X className="h-3 w-3" />
                            Clear
                        </button>
                    )}
                    <span className="text-[11px] text-sx-text-subtle tabular-nums">
                        {totalResults} post{totalResults !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
