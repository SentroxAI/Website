"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                               INPUT VARIANTS                               */
/* -------------------------------------------------------------------------- */

const inputVariants = cva(
    [
        "w-full rounded-2xl border bg-white/5 text-white",
        "backdrop-blur-xl",
        "outline-none",
        "placeholder:text-slate-500",
        "transition-all duration-300",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    {
        variants: {
            size: {
                sm: "px-4 py-2.5 text-sm",
                md: "px-5 py-3.5 text-base",
                lg: "px-6 py-4 text-lg",
            },

            variant: {
                default: "border-white/10 hover:border-white/20",
                error: "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                success: "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20",
            },
        },

        defaultVariants: {
            size: "md",
            variant: "default",
        },
    }
);

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
        VariantProps<typeof inputVariants> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            helperText,
            error,
            leftIcon,
            rightIcon,
            size,
            variant,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const resolvedVariant = error ? "error" : variant;

        return (
            <div className="w-full space-y-2">
                {/* Label */}

                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300"
                    >
                        {label}
                    </label>
                )}

                {/* Input Wrapper */}

                <div className="relative">
                    {/* Left Icon */}

                    {leftIcon && (
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            inputVariants({ size, variant: resolvedVariant }),
                            leftIcon && "pl-12",
                            rightIcon && "pr-12",
                            className
                        )}
                        {...props}
                    />

                    {/* Right Icon */}

                    {rightIcon && (
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {/* Error / Helper Text */}

                {error && (
                    <p className="text-sm text-red-400">{error}</p>
                )}

                {!error && helperText && (
                    <p className="text-sm text-slate-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
