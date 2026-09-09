"use client";

/* -------------------------------------------------------------------------- */
/*                        TEAM FILTERS                                        */
/*                                                                            */
/*  Horizontal filter bar: search, role pills, and sort dropdown.            */
/* -------------------------------------------------------------------------- */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamRole, TeamFilters as TeamFiltersType } from "@/app/actions/team";

interface TeamFiltersProps {
    filters: TeamFiltersType;
    onFiltersChange: (filters: TeamFiltersType) => void;
    totalResults: number;
}

const roleOptions: { value: TeamRole | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admins" },
    { value: "team", label: "Team" },
];

const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name_asc", label: "Name A → Z" },
    { value: "name_desc", label: "Name Z → A" },
];

export default function TeamFilters({
    filters,
    onFiltersChange,
    totalResults,
}: TeamFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Debounced search
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

    // Click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeFilterCount = [
        filters.role && filters.role !== "all",
        filters.search,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSearchValue("");
        onFiltersChange({ role: "all", search: "", sort: "newest" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
        >
            {/* Top row: search + sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by name, email, or phone..."
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

                {/* Sort dropdown */}
                <div ref={sortRef} className="relative">
                    <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-sx-text-muted transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
                    >
                        <span className="hidden sm:inline">
                            {sortOptions.find((o) => o.value === filters.sort)?.label || "Newest first"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    {showSortDropdown && (
                        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[160px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onFiltersChange({ ...filters, sort: opt.value as TeamFiltersType["sort"] });
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

            {/* Role pills row */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {roleOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onFiltersChange({ ...filters, role: opt.value })}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                (filters.role || "all") === opt.value
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
                        {totalResults} member{totalResults !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
