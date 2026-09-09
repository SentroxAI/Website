"use client";

/* -------------------------------------------------------------------------- */
/*                            ADMIN SHELL                                     */
/*                                                                            */
/*  Outer wrapper composing AdminSidebar + AdminHeader + Content area.        */
/*  Mirrors DashboardShell pattern but with admin-specific components.        */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebarContext } from "@/providers/SidebarProvider";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

/* ── Inner shell (needs sidebar context) ───────────────────────────────────── */

function ShellInner({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebarContext();
    const isMobile = useIsMobile();

    const sidebarWidth = isMobile ? 0 : isCollapsed ? 72 : 260;

    return (
        <div className="flex min-h-dvh bg-[#030712]">
            {/* Desktop sidebar */}
            <AdminSidebar />

            {/* Mobile sidebar */}
            <AdminMobileSidebar />

            {/* Main content area */}
            <div
                style={{
                    marginLeft: sidebarWidth,
                    transition: "margin-left 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
                className={cn("flex flex-1 flex-col min-w-0")}
            >
                <AdminHeader />

                {/* Page content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ── Exported shell ────────────────────────────────────────────────────────── */

export default function AdminShell({
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
