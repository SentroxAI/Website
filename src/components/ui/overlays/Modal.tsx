"use client";

import { type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showClose?: boolean;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              SIZE CLASSES                                  */
/* -------------------------------------------------------------------------- */

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    size = "md",
    showClose = true,
    className,
}: ModalProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <DialogPrimitive.Portal forceMount>
                        {/* Overlay */}

                        <DialogPrimitive.Overlay asChild forceMount>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            />
                        </DialogPrimitive.Overlay>

                        {/* Content */}

                        <DialogPrimitive.Content asChild forceMount>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className={cn(
                                    "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
                                    "rounded-3xl border border-white/10 bg-slate-900/95 p-8 backdrop-blur-2xl",
                                    "shadow-2xl",
                                    "max-h-[85vh] overflow-y-auto",
                                    sizeClasses[size],
                                    className
                                )}
                            >
                                {/* Glass Highlight */}

                                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent" />

                                {/* Top Edge */}

                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                <div className="relative">
                                    {/* Header */}

                                    {(title || showClose) && (
                                        <div className="mb-6 flex items-start justify-between">
                                            <div>
                                                {title && (
                                                    <DialogPrimitive.Title className="text-2xl font-bold text-white">
                                                        {title}
                                                    </DialogPrimitive.Title>
                                                )}

                                                {description && (
                                                    <DialogPrimitive.Description className="mt-2 text-slate-400">
                                                        {description}
                                                    </DialogPrimitive.Description>
                                                )}
                                            </div>

                                            {showClose && (
                                                <DialogPrimitive.Close className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                                                    <X className="h-5 w-5" />
                                                </DialogPrimitive.Close>
                                            )}
                                        </div>
                                    )}

                                    {/* Body */}

                                    {children}
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
