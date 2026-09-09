"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  BADGE                                     */
/*                                                                            */
/*  Small label component for statuses, counts, and tags.                     */
/*  Supports multiple visual variants and sizes.                              */
/* -------------------------------------------------------------------------- */

const badgeVariants = cva(
    "inline-flex items-center rounded-full font-medium transition-colors select-none",
    {
        variants: {
            variant: {
                default:
                    "bg-sx-primary/15 text-sx-primary-400 border border-sx-primary/20",
                secondary:
                    "bg-white/5 text-sx-text-muted border border-white/10",
                destructive:
                    "bg-sx-danger-bg text-sx-danger border border-sx-danger/20",
                success:
                    "bg-sx-success-bg text-sx-success border border-sx-success/20",
                warning:
                    "bg-sx-warning-bg text-sx-warning border border-sx-warning/20",
                info:
                    "bg-sx-info-bg text-sx-info border border-sx-info/20",
                outline:
                    "border border-white/10 text-sx-text-secondary bg-transparent",
            },
            size: {
                default: "px-2.5 py-0.5 text-xs",
                sm: "px-2 py-px text-[10px]",
                lg: "px-3 py-1 text-sm",
                dot: "h-2 w-2 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <span
            data-slot="badge"
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { badgeVariants };
