"use client";

/* -------------------------------------------------------------------------- */
/*                          ADMIN HEADER                                      */
/*                                                                            */
/*  Sticky top header bar with:                                               */
/*  - Mobile menu trigger                                                     */
/*  - Breadcrumbs (desktop)                                                   */
/*  - Search, Theme, Notifications, User dropdown                             */
/*  Glass effect background with shadow on scroll.                            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/providers/SidebarProvider";

import UserDropdown from "@/components/dashboard/UserDropdown";

/* ── Breadcrumb mapper ─────────────────────────────────────────────────────── */

const labelMap: Record<string, string> = {
    admin: "Admin",
    leads: "Leads",
    clients: "Clients",
    projects: "Projects",
    invoices: "Invoices",
    team: "Team",
    blog: "Blog",
    testimonials: "Testimonials",
    analytics: "Analytics",
    settings: "Settings",
};

export default function AdminHeader() {
    const { setMobileOpen } = useSidebarContext();
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    /* ── Shadow on scroll ──────────────────────────────────────────── */
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ── Build breadcrumbs ─────────────────────────────────────────── */
    const segments = pathname.split("/").filter(Boolean);
    const crumbs = segments.map((seg, i) => ({
        label: labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
        href: "/" + segments.slice(0, i + 1).join("/"),
        isLast: i === segments.length - 1,
    }));

    return (
        <header
            data-slot="admin-header"
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
            <nav className="hidden md:flex items-center gap-1 text-sm flex-1">
                {crumbs.map((crumb, i) => (
                    <span key={crumb.href} className="flex items-center gap-1">
                        {i > 0 && (
                            <ChevronRight className="h-3 w-3 text-sx-text-subtle/50" />
                        )}
                        {crumb.isLast ? (
                            <span className="font-medium text-white">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="text-sx-text-muted hover:text-white transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </span>
                ))}
            </nav>

            {/* ── Spacer (mobile) ──────────────────────────────────── */}
            <div className="flex-1 md:hidden" />

            {/* ── Right actions ────────────────────────────────────── */}
            <div className="flex items-center gap-1">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl text-sx-text-muted hover:bg-white/5 hover:text-white transition-colors">
                    <Search className="h-4 w-4" />
                </button>
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-sx-text-muted hover:bg-white/5 hover:text-white transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <div className="mx-1 h-6 w-px bg-white/8 hidden sm:block" />
                <UserDropdown />
            </div>
        </header>
    );
}
