"use client";

/* -------------------------------------------------------------------------- */
/*                           COMMAND PALETTE                                  */
/*                                                                            */
/*  ⌘K / Ctrl+K global search overlay.                                       */
/*  Categories: Projects, Messages, Files, Clients.                           */
/*  Keyboard navigation with arrow keys + Enter.                              */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    FolderKanban,
    MessageSquare,
    FileText,
    Users,
    ArrowRight,
    Hash,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface CommandItem {
    id: string;
    label: string;
    category: "projects" | "messages" | "files" | "clients";
    description?: string;
    href?: string;
    icon?: React.ReactNode;
}

interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
}

/* ── Category config ───────────────────────────────────────────────────────── */

const categoryConfig = {
    projects: { label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
    messages: { label: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
    files: { label: "Files", icon: <FileText className="h-4 w-4" /> },
    clients: { label: "Clients", icon: <Users className="h-4 w-4" /> },
};

/* ── Mock data (will connect to real data in later modules) ────────────────── */

const mockItems: CommandItem[] = [
    { id: "p1", label: "Website Redesign", category: "projects", description: "In progress · 75%" },
    { id: "p2", label: "Mobile App Development", category: "projects", description: "Active · 40%" },
    { id: "p3", label: "SEO Optimization", category: "projects", description: "Completed · 100%" },
    { id: "m1", label: "New message from team", category: "messages", description: "2 min ago" },
    { id: "m2", label: "Project update discussion", category: "messages", description: "1 hour ago" },
    { id: "f1", label: "brand-guidelines.pdf", category: "files", description: "PDF · 2.4 MB" },
    { id: "f2", label: "wireframes-v2.fig", category: "files", description: "Figma · 12 MB" },
    { id: "c1", label: "Acme Corporation", category: "clients", description: "Active client" },
    { id: "c2", label: "TechStart Inc.", category: "clients", description: "Active client" },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    /* ── Filter items ──────────────────────────────────────────────────── */

    const filtered = useMemo(() => {
        if (!query.trim()) return mockItems;
        const q = query.toLowerCase();
        return mockItems.filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q) ||
                item.category.includes(q)
        );
    }, [query]);

    /* ── Group by category ─────────────────────────────────────────────── */

    const grouped = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filtered.forEach((item) => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return groups;
    }, [filtered]);

    /* ── Reset on open ─────────────────────────────────────────────────── */

    useEffect(() => {
        if (open) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    /* ── Keyboard navigation ───────────────────────────────────────────── */

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter" && filtered[selectedIndex]) {
                e.preventDefault();
                // TODO: Navigate to item
                onClose();
            } else if (e.key === "Escape") {
                onClose();
            }
        },
        [filtered, selectedIndex, onClose]
    );

    /* ── Flat index tracker ────────────────────────────────────────────── */

    let flatIndex = -1;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-x-0 top-[15%] z-[101] mx-auto w-full max-w-[560px] px-4"
                        onKeyDown={handleKeyDown}
                    >
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1e]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            {/* Search input */}
                            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
                                <Search className="h-5 w-5 shrink-0 text-sx-text-muted" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search projects, messages, files…"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    className="flex-1 bg-transparent text-sm text-white placeholder:text-sx-text-subtle outline-none"
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="text-sx-text-muted hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-sx-text-muted">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div
                                className={cn(
                                    "max-h-[360px] overflow-y-auto py-2",
                                    "[scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]"
                                )}
                            >
                                {filtered.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <Hash className="mx-auto h-8 w-8 text-sx-text-subtle/50 mb-2" />
                                        <p className="text-sm text-sx-text-muted">
                                            No results found
                                        </p>
                                        <p className="text-xs text-sx-text-subtle mt-1">
                                            Try a different search term
                                        </p>
                                    </div>
                                ) : (
                                    Object.entries(grouped).map(([category, items]) => (
                                        <div key={category} className="mb-1">
                                            {/* Category header */}
                                            <div className="flex items-center gap-2 px-4 py-1.5">
                                                <span className="text-sx-text-subtle">
                                                    {categoryConfig[category as keyof typeof categoryConfig]?.icon}
                                                </span>
                                                <span className="text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                                    {categoryConfig[category as keyof typeof categoryConfig]?.label}
                                                </span>
                                            </div>

                                            {/* Items */}
                                            {items.map((item) => {
                                                flatIndex++;
                                                const isSelected = flatIndex === selectedIndex;
                                                const currentIndex = flatIndex;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        className={cn(
                                                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                                            isSelected
                                                                ? "bg-sx-primary/10 text-white"
                                                                : "text-sx-text-secondary hover:bg-white/5"
                                                        )}
                                                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                        onClick={() => {
                                                            // TODO: Navigate
                                                            onClose();
                                                        }}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="truncate text-sm font-medium">
                                                                {item.label}
                                                            </p>
                                                            {item.description && (
                                                                <p className="truncate text-xs text-sx-text-muted mt-0.5">
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {isSelected && (
                                                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-sx-primary-400" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className="flex items-center gap-4 border-t border-white/8 px-4 py-2.5">
                                <span className="flex items-center gap-1.5 text-[11px] text-sx-text-subtle">
                                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-px text-[10px]">↑↓</kbd>
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-sx-text-subtle">
                                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-px text-[10px]">↵</kbd>
                                    Open
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-sx-text-subtle">
                                    <kbd className="rounded border border-white/10 bg-white/5 px-1 py-px text-[10px]">Esc</kbd>
                                    Close
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
