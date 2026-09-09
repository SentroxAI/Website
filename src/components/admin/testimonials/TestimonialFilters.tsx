"use client";

/* -------------------------------------------------------------------------- */
/*                     TESTIMONIAL FILTERS                                    */
/* -------------------------------------------------------------------------- */

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestimonialFilters as TFilters } from "@/app/actions/testimonials";

interface TestimonialFiltersProps {
    filters: TFilters;
    onFiltersChange: (filters: TFilters) => void;
    totalResults: number;
}

const featuredOptions: { value: "all" | "featured" | "regular"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "featured", label: "Featured" },
    { value: "regular", label: "Regular" },
];

const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "rating_high", label: "Highest rated" },
    { value: "rating_low", label: "Lowest rated" },
    { value: "name_asc", label: "Name A → Z" },
];

const ratingOptions = [
    { value: "all" as const, label: "All Ratings" },
    { value: 5, label: "★★★★★  (5)" },
    { value: 4, label: "★★★★  (4)" },
    { value: 3, label: "★★★  (3)" },
    { value: 2, label: "★★  (2)" },
    { value: 1, label: "★  (1)" },
];

export default function TestimonialFilters({
    filters,
    onFiltersChange,
    totalResults,
}: TestimonialFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [showRatingDropdown, setShowRatingDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const ratingRef = useRef<HTMLDivElement>(null);
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
            if (ratingRef.current && !ratingRef.current.contains(e.target as Node)) setShowRatingDropdown(false);
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortDropdown(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeFilterCount = [
        filters.featured && filters.featured !== "all",
        filters.rating && filters.rating !== "all",
        filters.search,
    ].filter(Boolean).length;

    const clearFilters = () => {
        setSearchValue("");
        onFiltersChange({ featured: "all", search: "", rating: "all", sort: "newest" });
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
                        placeholder="Search by name, company, or content..."
                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-9 pr-9 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                    />
                    {searchValue && (
                        <button onClick={() => handleSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-sx-text-subtle hover:text-white transition-colors">
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Rating dropdown */}
                <div ref={ratingRef} className="relative">
                    <button
                        onClick={() => { setShowRatingDropdown(!showRatingDropdown); setShowSortDropdown(false); }}
                        className={cn(
                            "flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm transition-colors hover:border-white/[0.12]",
                            filters.rating && filters.rating !== "all" ? "text-white" : "text-sx-text-muted",
                        )}
                    >
                        <span className="hidden sm:inline">
                            {filters.rating && filters.rating !== "all" ? `${filters.rating} Stars` : "Rating"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {showRatingDropdown && (
                        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[150px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {ratingOptions.map((opt) => (
                                <button
                                    key={String(opt.value)}
                                    onClick={() => {
                                        onFiltersChange({ ...filters, rating: opt.value });
                                        setShowRatingDropdown(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center rounded-lg px-3 py-2 text-xs transition-colors",
                                        (filters.rating || "all") === opt.value ? "bg-white/[0.06] text-white" : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort dropdown */}
                <div ref={sortRef} className="relative">
                    <button
                        onClick={() => { setShowSortDropdown(!showSortDropdown); setShowRatingDropdown(false); }}
                        className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-sx-text-muted transition-colors hover:border-white/[0.12]"
                    >
                        <span className="hidden sm:inline">
                            {sortOptions.find((o) => o.value === filters.sort)?.label || "Newest first"}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    {showSortDropdown && (
                        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[170px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onFiltersChange({ ...filters, sort: opt.value as TFilters["sort"] });
                                        setShowSortDropdown(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center rounded-lg px-3 py-2 text-xs transition-colors",
                                        (filters.sort || "newest") === opt.value ? "bg-white/[0.06] text-white" : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Featured pills */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {featuredOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => onFiltersChange({ ...filters, featured: opt.value })}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                                (filters.featured || "all") === opt.value
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
                        <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors">
                            <X className="h-3 w-3" />
                            Clear
                        </button>
                    )}
                    <span className="text-[11px] text-sx-text-subtle tabular-nums">
                        {totalResults} review{totalResults !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
