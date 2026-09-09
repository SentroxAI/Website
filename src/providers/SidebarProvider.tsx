"use client";

/* -------------------------------------------------------------------------- */
/*                          SIDEBAR PROVIDER                                  */
/*                                                                            */
/*  React context that wraps the dashboard layout to provide sidebar          */
/*  collapsed/expanded state to all dashboard components.                     */
/* -------------------------------------------------------------------------- */

import { createContext, useContext, type ReactNode } from "react";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarContextType {
    isCollapsed: boolean;
    toggle: () => void;
    setCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    toggle: () => {},
    setCollapsed: () => {},
    isMobileOpen: false,
    setMobileOpen: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const sidebar = useSidebar();

    return (
        <SidebarContext.Provider value={sidebar}>
            {children}
        </SidebarContext.Provider>
    );
}

/**
 * Hook to access sidebar context from any dashboard component.
 * Must be used within a SidebarProvider.
 */
export function useSidebarContext(): SidebarContextType {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error(
            "useSidebarContext must be used within a SidebarProvider"
        );
    }

    return context;
}
