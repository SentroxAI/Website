"use client";

/* -------------------------------------------------------------------------- */
/*                        LEAD STATUS BADGE                                   */
/*                                                                            */
/*  Color-coded pill badge for lead statuses.                                 */
/*  Used in LeadsTable rows and LeadDetailDrawer.                             */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/app/actions/leads";

interface LeadStatusBadgeProps {
    status: LeadStatus;
    size?: "sm" | "md";
    className?: string;
}

const statusConfig: Record<
    LeadStatus,
    { label: string; bg: string; text: string; dot: string }
> = {
    new: {
        label: "New",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        dot: "bg-blue-400",
    },
    contacted: {
        label: "Contacted",
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        dot: "bg-cyan-400",
    },
    qualified: {
        label: "Qualified",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        dot: "bg-amber-400",
    },
    converted: {
        label: "Converted",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
    },
    lost: {
        label: "Lost",
        bg: "bg-red-500/10",
        text: "text-red-400",
        dot: "bg-red-400",
    },
};

export default function LeadStatusBadge({
    status,
    size = "sm",
    className,
}: LeadStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.new;

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

export { statusConfig };
