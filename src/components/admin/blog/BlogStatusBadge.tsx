"use client";

/* -------------------------------------------------------------------------- */
/*                     BLOG POST STATUS BADGE                                 */
/*                                                                            */
/*  Color-coded pill badge for post publish status.                          */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";

interface BlogStatusBadgeProps {
    published: boolean;
    size?: "sm" | "md";
    className?: string;
}

export const blogStatusConfig = {
    published: {
        label: "Published",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
    },
    draft: {
        label: "Draft",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        dot: "bg-amber-400",
    },
};

export default function BlogStatusBadge({
    published,
    size = "sm",
    className,
}: BlogStatusBadgeProps) {
    const config = published ? blogStatusConfig.published : blogStatusConfig.draft;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full font-medium",
                config.bg,
                config.text,
                size === "sm" && "px-2 py-0.5 text-[11px]",
                size === "md" && "px-3 py-1 text-xs",
                className,
            )}
        >
            <span
                className={cn(
                    "rounded-full",
                    config.dot,
                    size === "sm" && "h-1.5 w-1.5",
                    size === "md" && "h-2 w-2",
                )}
            />
            {config.label}
        </span>
    );
}
