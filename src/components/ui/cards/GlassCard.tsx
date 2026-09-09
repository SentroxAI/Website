"use client";

import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";
import { hoverCard } from "@/lib/animations";
import { ReactNode } from "react";
export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    blur?: "sm" | "md" | "lg";
    padding?: "none" | "sm" | "md" | "lg";
    radius?: "md" | "lg" | "xl" | "2xl";
    bordered?: boolean;
    hover?: boolean;
    glow?: boolean;
}

const blurClasses = {
    sm: "backdrop-blur-md",
    md: "backdrop-blur-xl",
    lg: "backdrop-blur-2xl",
} as const;

const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-5 sm:p-6 lg:p-8",
} as const;

const radiusClasses = {
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    "2xl": "rounded-[32px]",
} as const;

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    (
        {
            className,
            children,
            blur = "lg",
            padding = "lg",
            radius = "2xl",
            bordered = true,
            hover = true,
            glow = false,
            ...props
        },
        ref
    ) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hover ? hoverCard.whileHover : undefined}
                whileTap={hover ? hoverCard.whileTap : undefined}
                className={cn(
                    "relative overflow-hidden bg-white/5",
                    blurClasses[blur],
                    paddingClasses[padding],
                    radiusClasses[radius],
                    bordered && "border border-white/10",
                    glow && "shadow-[0_0_60px_rgba(37,99,235,0.15)]",
                    className
                )}
                {...props}
            >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="relative z-10">{children}</div>
            </motion.div>
        );
    }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;