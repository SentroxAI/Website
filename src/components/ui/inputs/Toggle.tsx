"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              TOGGLE / SWITCH                               */
/* -------------------------------------------------------------------------- */

interface ToggleProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    label?: string;
    description?: string;
    className?: string;
    id?: string;
}

const sizeMap = {
    sm: {
        track: "w-8 h-[18px]",
        thumb: "w-3.5 h-3.5",
        translate: "translateX(14px)",
        label: "text-sm",
    },
    md: {
        track: "w-11 h-6",
        thumb: "w-5 h-5",
        translate: "translateX(20px)",
        label: "text-sm",
    },
    lg: {
        track: "w-14 h-7",
        thumb: "w-6 h-6",
        translate: "translateX(28px)",
        label: "text-base",
    },
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
    (
        {
            checked = false,
            onChange,
            disabled = false,
            size = "md",
            label,
            description,
            className,
            id,
        },
        ref
    ) => {
        const s = sizeMap[size];

        return (
            <div className={cn("flex items-start gap-3", className)}>
                <button
                    ref={ref}
                    id={id}
                    role="switch"
                    type="button"
                    aria-checked={checked}
                    disabled={disabled}
                    onClick={() => onChange?.(!checked)}
                    className={cn(
                        "relative inline-flex shrink-0 cursor-pointer rounded-full border border-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]",
                        s.track,
                        checked
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-500/30"
                            : "bg-white/10",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <motion.span
                        className={cn(
                            "pointer-events-none block rounded-full bg-white shadow-lg",
                            s.thumb
                        )}
                        initial={false}
                        animate={{
                            x: checked ? parseInt(s.translate.match(/\d+/)?.[0] || "0") : 2,
                            y: size === "sm" ? 1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </button>

                {(label || description) && (
                    <div className="flex flex-col">
                        {label && (
                            <span
                                className={cn(
                                    "font-medium text-white leading-tight",
                                    s.label,
                                    disabled && "text-slate-500"
                                )}
                            >
                                {label}
                            </span>
                        )}
                        {description && (
                            <span className="text-xs text-slate-500 mt-0.5">
                                {description}
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Toggle.displayName = "Toggle";

export default Toggle;
