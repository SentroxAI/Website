"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    label?: string;
    description?: string;
    error?: string;
    indeterminate?: boolean;
    size?: "sm" | "md" | "lg";
}

/* -------------------------------------------------------------------------- */
/*                              SIZE CLASSES                                  */
/* -------------------------------------------------------------------------- */

const sizes = {
    sm: {
        box: "h-4 w-4 rounded-md",
        icon: "h-3 w-3",
        label: "text-sm",
        description: "text-xs",
    },
    md: {
        box: "h-5 w-5 rounded-lg",
        icon: "h-3.5 w-3.5",
        label: "text-base",
        description: "text-sm",
    },
    lg: {
        box: "h-6 w-6 rounded-lg",
        icon: "h-4 w-4",
        label: "text-lg",
        description: "text-sm",
    },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            className,
            label,
            description,
            error,
            indeterminate = false,
            size = "md",
            checked,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const s = sizes[size];
        const isChecked = checked || indeterminate;

        return (
            <div className={cn("flex items-start gap-3", className)}>
                {/* Hidden Input + Visual Box */}

                <label
                    htmlFor={inputId}
                    className="relative flex-shrink-0 cursor-pointer"
                >
                    <input
                        ref={ref}
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        className="peer sr-only"
                        {...props}
                    />

                    <div
                        className={cn(
                            s.box,
                            "flex items-center justify-center border transition-all duration-200",
                            isChecked
                                ? "border-blue-500 bg-blue-600"
                                : "border-white/20 bg-white/5 hover:border-white/30"
                        )}
                    >
                        {isChecked && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                {indeterminate ? (
                                    <Minus className={cn(s.icon, "text-white")} />
                                ) : (
                                    <Check className={cn(s.icon, "text-white")} />
                                )}
                            </motion.div>
                        )}
                    </div>
                </label>

                {/* Label + Description */}

                {(label || description) && (
                    <div className="flex-1">
                        {label && (
                            <label
                                htmlFor={inputId}
                                className={cn(
                                    s.label,
                                    "cursor-pointer font-medium text-white"
                                )}
                            >
                                {label}
                            </label>
                        )}

                        {description && (
                            <p
                                className={cn(
                                    s.description,
                                    "mt-0.5 text-slate-400"
                                )}
                            >
                                {description}
                            </p>
                        )}

                        {error && (
                            <p className="mt-1 text-sm text-red-400">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
