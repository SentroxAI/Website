"use client";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              SCROLL AREA                                   */
/*                                                                            */
/*  Custom-styled scrollable container with thin, themed scrollbar.           */
/*  Used in sidebar nav and dropdown menus for overflow content.              */
/* -------------------------------------------------------------------------- */

interface ScrollAreaProps {
    children: React.ReactNode;
    className?: string;
}

export default function ScrollArea({ children, className }: ScrollAreaProps) {
    return (
        <div
            data-slot="scroll-area"
            className={cn(
                "overflow-y-auto",
                /* Custom scrollbar styling */
                "[scrollbar-width:thin]",
                "[scrollbar-color:rgba(255,255,255,0.08)_transparent]",
                /* Webkit scrollbar */
                "[&::-webkit-scrollbar]:w-1.5",
                "[&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:rounded-full",
                "[&::-webkit-scrollbar-thumb]:bg-white/8",
                "hover:[&::-webkit-scrollbar-thumb]:bg-white/15",
                className
            )}
        >
            {children}
        </div>
    );
}
