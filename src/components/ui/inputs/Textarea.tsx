"use client";

import {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    type TextareaHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                             TEXTAREA VARIANTS                              */
/* -------------------------------------------------------------------------- */

const textareaVariants = cva(
    [
        "w-full rounded-2xl border bg-white/5 text-white",
        "backdrop-blur-xl",
        "outline-none resize-none",
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

export interface TextareaProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
        VariantProps<typeof textareaVariants> {
    label?: string;
    helperText?: string;
    error?: string;
    showCount?: boolean;
    autoResize?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            label,
            helperText,
            error,
            showCount,
            autoResize = false,
            size,
            variant,
            maxLength,
            value,
            id,
            onChange,
            ...props
        },
        ref
    ) => {
        const internalRef = useRef<HTMLTextAreaElement | null>(null);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const resolvedVariant = error ? "error" : variant;
        const charCount = typeof value === "string" ? value.length : 0;

        const resize = useCallback(() => {
            const el = internalRef.current;

            if (!el || !autoResize) return;

            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }, [autoResize]);

        useEffect(() => {
            resize();
        }, [value, resize]);

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

                {/* Textarea */}

                <textarea
                    ref={(node) => {
                        internalRef.current = node;

                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    id={inputId}
                    value={value}
                    maxLength={maxLength}
                    onChange={(e) => {
                        onChange?.(e);
                        resize();
                    }}
                    className={cn(
                        textareaVariants({ size, variant: resolvedVariant }),
                        "min-h-[120px]",
                        className
                    )}
                    {...props}
                />

                {/* Footer */}

                <div className="flex items-center justify-between">
                    <div>
                        {error && (
                            <p className="text-sm text-red-400">{error}</p>
                        )}

                        {!error && helperText && (
                            <p className="text-sm text-slate-500">
                                {helperText}
                            </p>
                        )}
                    </div>

                    {showCount && maxLength && (
                        <p className="text-xs text-slate-500">
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export default Textarea;
