"use client";

/* -------------------------------------------------------------------------- */
/*                          USE-SIDEBAR HOOK                                   */
/*                                                                            */
/*  Manages sidebar collapsed/expanded state.                                 */
/*  Persists collapsed preference to localStorage.                            */
/*  Auto-collapses on tablet breakpoints.                                     */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sentrox-sidebar-collapsed";
const TABLET_BREAKPOINT = 1024;

interface UseSidebarReturn {
    /** Whether the sidebar is collapsed (icon-only mode) */
    isCollapsed: boolean;
    /** Toggle collapsed state */
    toggle: () => void;
    /** Set collapsed state explicitly */
    setCollapsed: (collapsed: boolean) => void;
    /** Whether the mobile sidebar sheet is open */
    isMobileOpen: boolean;
    /** Open/close the mobile sidebar sheet */
    setMobileOpen: (open: boolean) => void;
}

export function useSidebar(): UseSidebarReturn {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setMobileOpen] = useState(false);

    /* ── Read persisted preference on mount ─────────────────────────────── */

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored !== null) {
                setIsCollapsed(JSON.parse(stored));
            }
        } catch {
            // localStorage unavailable
        }
    }, []);

    /* ── Auto-collapse on tablet breakpoint ─────────────────────────────── */

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);

        const onChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setIsCollapsed(true);
            }
        };

        // Set initial value for tablet
        if (mql.matches) {
            setIsCollapsed(true);
        }

        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    /* ── Toggle with persistence ────────────────────────────────────────── */

    const toggle = useCallback(() => {
        setIsCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // localStorage unavailable
            }
            return next;
        });
    }, []);

    const setCollapsed = useCallback((collapsed: boolean) => {
        setIsCollapsed(collapsed);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
        } catch {
            // localStorage unavailable
        }
    }, []);

    return {
        isCollapsed,
        toggle,
        setCollapsed,
        isMobileOpen,
        setMobileOpen,
    };
}
