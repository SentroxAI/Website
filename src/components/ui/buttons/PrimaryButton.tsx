"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./buttonVariants";

export interface PrimaryButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    href?: string;
}

export default function PrimaryButton({
    className,
    variant = "primary",
    size,
    fullWidth,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    href,
    disabled,
    ...props
}: PrimaryButtonProps) {
    const classes = cn(
        buttonVariants({
            variant,
            size,
            fullWidth,
        }),
        className
    );

    if (href) {
        return (
            <Link href={href} className={classes}>
                {leftIcon && !loading && leftIcon}

                <span>{children}</span>

                {rightIcon && !loading && rightIcon}
            </Link>
        );
    }

    return (
        <button
            type={props.type ?? "button"}
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