"use client";

/* -------------------------------------------------------------------------- */
/*                       TEAM ROLE BADGE                                      */
/*                                                                            */
/*  Color-coded pill badge for user roles.                                    */
/*  Used in TeamTable rows and TeamDetailDrawer.                             */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import type { TeamRole } from "@/app/actions/team";

interface TeamRoleBadgeProps {
    role: TeamRole;
    size?: "sm" | "md";
    className?: string;
}

export const teamRoleConfig: Record<
    TeamRole,
    { label: string; bg: string; text: string; dot: string }
> = {
    admin: {
        label: "Admin",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        dot: "bg-rose-400",
    },
    team: {
        label: "Team",
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        dot: "bg-sky-400",
    },
};

export default function TeamRoleBadge({
    role,
    size = "sm",
    className,
}: TeamRoleBadgeProps) {
    const config = teamRoleConfig[role] || teamRoleConfig.team;

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
