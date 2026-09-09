"use client";

/* -------------------------------------------------------------------------- */
/*                          DASHBOARD SHELL                                   */
/*                                                                            */
/*  Outer wrapper that composes Sidebar + Header + Content area.              */
/*  Handles responsive layout structure with sidebar width transitions.       */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebarContext } from "@/providers/SidebarProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

/* ── Inner shell (needs sidebar context) ───────────────────────────────────── */

function ShellInner({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebarContext();
    const isMobile = useIsMobile();

    const sidebarWidth = isMobile ? 0 : isCollapsed ? 72 : 256;

    return (
        <div className="flex min-h-dvh bg-[#030712]">
            {/* Desktop sidebar */}
            <DashboardSidebar />

            {/* Mobile sidebar */}
            <MobileSidebar />

            {/* Main content area */}
            <div
                style={{
                    marginLeft: sidebarWidth,
                    transition: "margin-left 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
                className={cn("flex flex-1 flex-col min-w-0")}
            >
                <DashboardHeader />

                {/* Page content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ── Exported shell (wraps with SidebarProvider) ───────────────────────────── */

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <ShellInner>{children}</ShellInner>
        </SidebarProvider>
    );
}
