"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              SELECT VARIANTS                               */
/* -------------------------------------------------------------------------- */

const selectVariants = cva(
    [
        "w-full appearance-none rounded-2xl border bg-white/5 text-white",
        "backdrop-blur-xl",
        "outline-none cursor-pointer",
        "transition-all duration-300",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    {
        variants: {
            size: {
                sm: "px-4 py-2.5 pr-10 text-sm",
                md: "px-5 py-3.5 pr-12 text-base",
                lg: "px-6 py-4 pr-14 text-lg",
            },

            variant: {
                default: "border-white/10 hover:border-white/20",
                error: "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
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

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface SelectProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
        VariantProps<typeof selectVariants> {
    label?: string;
    helperText?: string;
    error?: string;
    placeholder?: string;
    options: SelectOption[];
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            className,
            label,
            helperText,
            error,
            placeholder,
            options,
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

                {/* Select Wrapper */}

                <div className="relative">
                    <select
                        ref={ref}
                        id={inputId}
                        className={cn(
                            selectVariants({
                                size,
                                variant: resolvedVariant,
                            }),
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled className="bg-slate-900">
                                {placeholder}
                            </option>
                        )}

                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className="bg-slate-900"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Chevron Icon */}

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
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

Select.displayName = "Select";

export default Select;
