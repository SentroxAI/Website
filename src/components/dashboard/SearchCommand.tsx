"use client";

/* -------------------------------------------------------------------------- */
/*                           SEARCH COMMAND                                   */
/*                                                                            */
/*  Search trigger button in the header.                                      */
/*  Shows ⌘K shortcut hint.                                                   */
/*  Opens the CommandPalette overlay.                                         */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import CommandPalette from "@/components/ui/overlays/CommandPalette";

export default function SearchCommand() {
    const [open, setOpen] = useState(false);

    /* ── Global keyboard shortcut ──────────────────────────────────────── */

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            }
        },
        []
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-sx-text-muted transition-colors hover:bg-white/[0.06] hover:text-sx-text-secondary hover:border-white/10"
            >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search…</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-sx-text-subtle ml-4">
                    ⌘K
                </kbd>
            </button>

            <CommandPalette open={open} onClose={() => setOpen(false)} />
        </>
    );
}
