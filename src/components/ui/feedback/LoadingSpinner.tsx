"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    label?: string;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              SIZE CLASSES                                  */
/* -------------------------------------------------------------------------- */

const sizes = {
    sm: { ring: "h-5 w-5", border: "border-2", label: "text-xs" },
    md: { ring: "h-8 w-8", border: "border-[3px]", label: "text-sm" },
    lg: { ring: "h-12 w-12", border: "border-4", label: "text-base" },
    xl: { ring: "h-16 w-16", border: "border-4", label: "text-lg" },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function LoadingSpinner({
    size = "md",
    label,
    className,
}: LoadingSpinnerProps) {
    const s = sizes[size];

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3",
                className
            )}
            role="status"
            aria-label={label || "Loading"}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className={cn(
                    s.ring,
                    s.border,
                    "rounded-full border-white/20 border-t-blue-500"
                )}
            />

            {label && (
                <p className={cn(s.label, "text-slate-400")}>{label}</p>
            )}
        </div>
    );
}
