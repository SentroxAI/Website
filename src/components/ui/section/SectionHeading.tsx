"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import GradientBadge from "@/components/ui/badges/GradientBadge";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

interface SectionHeadingProps {
    badge?: string;
    badgeIcon?: React.ReactNode;

    title: string;

    description?: string;

    align?: "left" | "center";

    maxWidth?: "md" | "lg" | "xl";

    action?: {
        label: string;
        href: string;
    };

    className?: string;
}

const maxWidths = {
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
};

export default function SectionHeading({
    badge,
    badgeIcon,
    title,
    description,
    align = "center",
    maxWidth = "lg",
    action,
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "mb-16 flex flex-col gap-6",
                align === "center"
                    ? "items-center text-center"
                    : "items-start text-left",
                className
            )}
        >
            {badge && (
                <GradientBadge
                    leftIcon={badgeIcon}
                    variant="primary"
                >
                    {badge}
                </GradientBadge>
            )}

            <h2
                className={cn(
                    "text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl",
                    maxWidths[maxWidth]
                )}
            >
                {title}
            </h2>

            {description && (
                <p
                    className={cn(
                        "text-lg leading-8 text-slate-400",
                        maxWidths[maxWidth]
                    )}
                >
                    {description}
                </p>
            )}

            {action && (
                <PrimaryButton
                    href={action.href}
                    rightIcon={<ArrowRight size={18} />}
                >
                    {action.label}
                </PrimaryButton>
            )}
        </div>
    );
}