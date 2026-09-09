"use client";

import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
    spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
    sm: "py-10 sm:py-16 lg:py-20",
    md: "py-12 sm:py-20 lg:py-28",
    lg: "py-16 sm:py-24 lg:py-32",
};

export default function Section({
    spacing = "lg",
    className,
    children,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                "relative overflow-hidden",
                spacingClasses[spacing],
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}