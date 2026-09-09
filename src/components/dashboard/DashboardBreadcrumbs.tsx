"use client";

/* -------------------------------------------------------------------------- */
/*                        DASHBOARD BREADCRUMBS                               */
/*                                                                            */
/*  Auto-generates breadcrumbs from the current pathname.                     */
/*  Maps route segments to human-readable labels.                             */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Segment → Label map ───────────────────────────────────────────────────── */

const segmentLabels: Record<string, string> = {
    dashboard: "Dashboard",
    projects: "Projects",
    messages: "Messages",
    files: "Files",
    meetings: "Meetings",
    invoices: "Invoices",
    profile: "Profile",
    settings: "Settings",
};

interface DashboardBreadcrumbsProps {
    className?: string;
}

export default function DashboardBreadcrumbs({
    className,
}: DashboardBreadcrumbsProps) {
    const pathname = usePathname();

    /* ── Build breadcrumb items from pathname ───────────────────────────── */

    const segments = pathname
        .split("/")
        .filter(Boolean)
        .filter((s) => s !== "dashboard"); // Remove the base "dashboard" segment

    // If we're at /dashboard root, show nothing extra
    const items = segments.map((segment, index) => {
        const href = "/dashboard/" + segments.slice(0, index + 1).join("/");
        const label =
            segmentLabels[segment] ||
            segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
        return { label, href };
    });

    return (
        <nav
            aria-label="Dashboard breadcrumb"
            className={cn("flex items-center gap-1.5 text-sm", className)}
        >
            {/* Dashboard root */}
            <Link
                href="/dashboard"
                className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    items.length === 0
                        ? "font-medium text-white"
                        : "text-sx-text-muted hover:text-sx-text-secondary"
                )}
            >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {/* Segments */}
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={item.href} className="flex items-center gap-1.5">
                        <ChevronRight className="h-3.5 w-3.5 text-sx-text-subtle" />
                        {isLast ? (
                            <span className="font-medium text-white">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-sx-text-muted transition-colors hover:text-sx-text-secondary"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
