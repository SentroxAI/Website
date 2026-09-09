"use client";

/* -------------------------------------------------------------------------- */
/*                            SIDEBAR GROUP                                   */
/*                                                                            */
/*  Groups sidebar items with an optional label header.                       */
/*  Label hides when sidebar is collapsed.                                    */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/providers/SidebarProvider";

interface SidebarGroupProps {
    label?: string;
    children: React.ReactNode;
    className?: string;
}

export default function SidebarGroup({
    label,
    children,
    className,
}: SidebarGroupProps) {
    const { isCollapsed } = useSidebarContext();

    return (
        <div className={cn("px-3 py-1", className)}>
            {/* Group label */}
            {label && !isCollapsed && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle/70">
                    {label}
                </p>
            )}

            {/* Collapsed divider (replaces label) */}
            {label && isCollapsed && (
                <div className="mx-auto mb-2 h-px w-6 bg-white/8" />
            )}

            <div className="flex flex-col gap-0.5">{children}</div>
        </div>
    );
}
