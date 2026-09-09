"use client";

import { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType = "div"> = {
    as?: T;
    size?: "sm" | "md" | "lg" | "xl" | "full";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
};

export default function Container<T extends ElementType = "div">({
    as,
    size = "xl",
    className,
    children,
    ...props
}: ContainerProps<T>) {
    const Component = as || "div";

    return (
        <Component
            className={cn(
                "mx-auto w-full px-4 sm:px-6 lg:px-8",
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}