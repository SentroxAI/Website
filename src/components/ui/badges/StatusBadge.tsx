"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                           STATUS BADGE VARIANTS                            */
/* -------------------------------------------------------------------------- */

const statusBadgeVariants = cva(
    [
        "inline-flex items-center gap-2",
        "rounded-full px-3 py-1",
        "text-xs font-medium",
        "border backdrop-blur-xl",
    ],
    {
        variants: {
            status: {
                active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
                completed: "border-blue-500/20 bg-blue-500/10 text-blue-400",
                cancelled: "border-red-500/20 bg-red-500/10 text-red-400",
                draft: "border-white/10 bg-white/5 text-slate-400",
            },

            animated: {
                true: "",
                false: "",
            },
        },

        defaultVariants: {
            status: "active",
            animated: true,
        },
    }
);

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface StatusBadgeProps
    extends VariantProps<typeof statusBadgeVariants> {
    label: string;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              DOT COLORS                                    */
/* -------------------------------------------------------------------------- */

const dotColors = {
    active: "bg-emerald-400",
    pending: "bg-amber-400",
    completed: "bg-blue-400",
    cancelled: "bg-red-400",
    draft: "bg-slate-400",
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function StatusBadge({
    status = "active",
    animated = true,
    label,
    className,
}: StatusBadgeProps) {
    const resolvedStatus = status ?? "active";

    return (
        <span className={cn(statusBadgeVariants({ status, animated }), className)}>
            {/* Animated Dot */}

            <span className="relative flex h-2 w-2">
                {animated && (
                    <span
                        className={cn(
                            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                            dotColors[resolvedStatus]
                        )}
                    />
                )}

                <span
                    className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        dotColors[resolvedStatus]
                    )}
                />
            </span>

            {label}
        </span>
    );
}
