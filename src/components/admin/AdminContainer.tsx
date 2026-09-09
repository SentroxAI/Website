"use client";

/* -------------------------------------------------------------------------- */
/*                        ADMIN CONTAINER                                     */
/*                                                                            */
/*  Content wrapper with consistent padding for admin pages.                  */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface AdminContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function AdminContainer({ children, className }: AdminContainerProps) {
    return (
        <div className={cn("px-4 py-6 md:px-6 lg:px-8", className)}>
            {children}
        </div>
    );
}
