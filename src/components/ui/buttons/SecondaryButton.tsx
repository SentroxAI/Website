"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./buttonVariants";

export interface SecondaryButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    href?: string;
}

export default function SecondaryButton({
    className,
    size,
    fullWidth,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    href,
    disabled,
    ...props
}: SecondaryButtonProps) {
    const classes = cn(
        buttonVariants({
            variant: "secondary",
            size,
            fullWidth,
        }),
        className
    );

    if (href) {
        return (
            <Link href={href} className={classes}>
                {leftIcon}

                <span>{children}</span>

                {rightIcon}
            </Link>
        );
    }

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                leftIcon
            )}

            <span>{children}</span>

            {!loading && rightIcon}
        </button>
    );
}