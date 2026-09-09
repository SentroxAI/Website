"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                               PAGINATION                                   */
/* -------------------------------------------------------------------------- */

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
}

function generatePages(
    current: number,
    total: number,
    siblings: number
): (number | "...")[] {
    const pages: (number | "...")[] = [];

    const leftSibling = Math.max(current - siblings, 1);
    const rightSibling = Math.min(current + siblings, total);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    if (total <= siblings * 2 + 5) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }

    pages.push(1);

    if (showLeftDots) {
        pages.push("...");
    } else {
        for (let i = 2; i < leftSibling; i++) pages.push(i);
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
        if (i !== 1 && i !== total) pages.push(i);
    }

    if (showRightDots) {
        pages.push("...");
    } else {
        for (let i = rightSibling + 1; i < total; i++) pages.push(i);
    }

    pages.push(total);

    return pages;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = generatePages(currentPage, totalPages, siblingCount);

    return (
        <nav
            className={cn("flex items-center justify-center gap-1.5", className)}
            aria-label="Pagination"
        >
            {/* Previous */}
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
                className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-slate-400 transition-all duration-200",
                    currentPage <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-white/5 hover:text-white hover:border-white/20"
                )}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pages */}
            {pages.map((page, idx) => {
                if (page === "...") {
                    return (
                        <span
                            key={`dots-${idx}`}
                            className="flex items-center justify-center w-9 h-9 text-slate-500"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </span>
                    );
                }

                const isActive = page === currentPage;

                return (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={`Page ${page}`}
                        className={cn(
                            "flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 border border-blue-500/30"
                                : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/20"
                        )}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next */}
            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-slate-400 transition-all duration-200",
                    currentPage >= totalPages
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-white/5 hover:text-white hover:border-white/20"
                )}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
}
