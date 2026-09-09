"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    [
        "inline-flex items-center justify-center",
        "rounded-full",
        "border",
        "font-medium",
        "transition-all duration-300",
        "backdrop-blur-xl",
        "select-none",
        "whitespace-nowrap",
    ],
    {
        variants: {
            variant: {
                primary:
                    "border-blue-500/20 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-300",

                secondary:
                    "border-white/10 bg-white/5 text-white",

                success:
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

                warning:
                    "border-amber-500/20 bg-amber-500/10 text-amber-300",

                danger:
                    "border-red-500/20 bg-red-500/10 text-red-300",
            },

            size: {
                sm: "px-3 py-1 text-xs",

                md: "px-4 py-2 text-sm",

                lg: "px-5 py-2.5 text-base",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface GradientBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function GradientBadge({
    className,
    variant,
    size,
    leftIcon,
    rightIcon,
    children,
    ...props
}: GradientBadgeProps) {
    return (
        <div
            className={cn(
                badgeVariants({
                    variant,
                    size,
                }),
                className
            )}
            {...props}
        >
            {leftIcon && (
                <span className="mr-2 flex items-center">
                    {leftIcon}
                </span>
            )}

            <span>{children}</span>

            {rightIcon && (
                <span className="ml-2 flex items-center">
                    {rightIcon}
                </span>
            )}
        </div>
    );
}