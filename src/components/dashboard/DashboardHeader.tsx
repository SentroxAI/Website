"use client";

/* -------------------------------------------------------------------------- */
/*                          DASHBOARD HEADER                                  */
/*                                                                            */
/*  Sticky top header bar with:                                               */
/*  - Mobile menu trigger (hamburger, mobile only)                            */
/*  - Breadcrumbs (desktop)                                                   */
/*  - Search trigger                                                          */
/*  - Theme toggle                                                            */
/*  - Notification bell                                                       */
/*  - User avatar/dropdown                                                    */
/*  Glass effect background with shadow on scroll.                            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/providers/SidebarProvider";
import DashboardBreadcrumbs from "@/components/dashboard/DashboardBreadcrumbs";
import SearchCommand from "@/components/dashboard/SearchCommand";

import NotificationBell from "@/components/dashboard/NotificationBell";
import UserDropdown from "@/components/dashboard/UserDropdown";

export default function DashboardHeader() {
    const { setMobileOpen } = useSidebarContext();
    const [scrolled, setScrolled] = useState(false);

    /* ── Shadow on scroll ──────────────────────────────────────────────── */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 8);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            data-slot="dashboard-header"
            className={cn(
                "sticky top-0 z-30 flex h-16 items-center gap-4 px-4 md:px-6 transition-all duration-300",
                "border-b bg-[#060a14]/80 backdrop-blur-xl",
                scrolled
                    ? "border-white/[0.08] shadow-lg shadow-black/10"
                    : "border-transparent"
            )}
        >
            {/* ── Mobile hamburger ─────────────────────────────────── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-sx-text-muted hover:bg-white/5 hover:text-white transition-colors md:hidden"
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* ── Breadcrumbs (desktop) ────────────────────────────── */}
            <div className="hidden md:flex flex-1">
                <DashboardBreadcrumbs />
            </div>

            {/* ── Spacer (mobile) ──────────────────────────────────── */}
            <div className="flex-1 md:hidden" />

            {/* ── Right actions ────────────────────────────────────── */}
            <div className="flex items-center gap-1">
                <SearchCommand />
                <NotificationBell />
                <div className="mx-1 h-6 w-px bg-white/8 hidden sm:block" />
                <UserDropdown />
            </div>
        </header>
    );
}
