"use client";

/* -------------------------------------------------------------------------- */
/*                     PROJECT STATUS BADGE                                   */
/*                                                                            */
/*  Color-coded pill badge for project statuses.                              */
/*  Used in ProjectsTable rows and ProjectDetailDrawer.                      */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/app/actions/projects";

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
    size?: "sm" | "md";
    className?: string;
}

export const projectStatusConfig: Record<
    ProjectStatus,
    { label: string; bg: string; text: string; dot: string }
> = {
    active: {
        label: "Active",
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        dot: "bg-violet-400",
    },
    completed: {
        label: "Completed",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
    },
    pending: {
        label: "Pending",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        dot: "bg-amber-400",
    },
    cancelled: {
        label: "Cancelled",
        bg: "bg-red-500/10",
        text: "text-red-400",
        dot: "bg-red-400",
    },
};

export default function ProjectStatusBadge({
    status,
    size = "sm",
    className,
}: ProjectStatusBadgeProps) {
    const config = projectStatusConfig[status] || projectStatusConfig.pending;

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
