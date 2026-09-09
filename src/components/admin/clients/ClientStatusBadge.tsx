"use client";

/* -------------------------------------------------------------------------- */
/*                      CLIENT STATUS BADGE                                   */
/*                                                                            */
/*  Color-coded pill badge for client statuses.                               */
/*  Used in ClientsTable rows and ClientDetailDrawer.                         */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import type { ClientStatus } from "@/app/actions/clients";

interface ClientStatusBadgeProps {
    status: ClientStatus;
    size?: "sm" | "md";
    className?: string;
}

export const clientStatusConfig: Record<
    ClientStatus,
    { label: string; bg: string; text: string; dot: string }
> = {
    active: {
        label: "Active",
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
    inactive: {
        label: "Inactive",
        bg: "bg-zinc-500/10",
        text: "text-zinc-400",
        dot: "bg-zinc-400",
    },
};

export default function ClientStatusBadge({
    status,
    size = "sm",
    className,
}: ClientStatusBadgeProps) {
    const config = clientStatusConfig[status] || clientStatusConfig.active;

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
