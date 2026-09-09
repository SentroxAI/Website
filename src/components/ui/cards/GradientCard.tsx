"use client";

import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface GradientCardProps
    extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    gradient?: "primary" | "accent" | "mixed" | "subtle";
    padding?: "none" | "sm" | "md" | "lg";
    radius?: "lg" | "xl" | "2xl" | "3xl";
    hover?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                            GRADIENT CLASSES                                */
/* -------------------------------------------------------------------------- */

const gradientClasses = {
    primary:
        "bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-slate-900/50",
    accent:
        "bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-slate-900/50",
    mixed:
        "bg-gradient-to-br from-blue-600/20 via-transparent to-cyan-500/20",
    subtle:
        "bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent",
};

const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

const radiusClasses = {
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    "2xl": "rounded-[32px]",
    "3xl": "rounded-[36px]",
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
    (
        {
            children,
            gradient = "mixed",
            padding = "lg",
            radius = "2xl",
            hover = true,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <motion.div
                ref={ref}
                whileHover={
                    hover
                        ? { y: -6, scale: 1.01, transition: { duration: 0.3 } }
                        : undefined
                }
                whileTap={hover ? { scale: 0.99 } : undefined}
                className={cn(
                    "relative overflow-hidden border border-white/10 backdrop-blur-2xl",
                    gradientClasses[gradient],
                    paddingClasses[padding],
                    radiusClasses[radius],
                    className
                )}
                {...props}
            >
                {/* Gradient Overlay */}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-60" />

                {/* Top Edge */}

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Content */}

                <div className="relative z-10">{children}</div>
            </motion.div>
        );
    }
);

GradientCard.displayName = "GradientCard";

export default GradientCard;
