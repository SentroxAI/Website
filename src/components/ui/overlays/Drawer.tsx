"use client";

import { type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: ReactNode;
    side?: "left" | "right" | "bottom";
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                            SIDE ANIMATIONS                                 */
/* -------------------------------------------------------------------------- */

const sideVariants = {
    left: {
        initial: { x: "-100%" },
        animate: { x: 0 },
        exit: { x: "-100%" },
        className: "left-0 top-0 h-full w-full max-w-md",
    },
    right: {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        className: "right-0 top-0 h-full w-full max-w-md",
    },
    bottom: {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        className:
            "bottom-0 left-0 w-full max-h-[80vh] rounded-t-3xl",
    },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Drawer({
    open,
    onOpenChange,
    title,
    description,
    children,
    side = "right",
    className,
}: DrawerProps) {
    const config = sideVariants[side];

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
                                initial={config.initial}
                                animate={config.animate}
                                exit={config.exit}
                                transition={{
                                    type: "spring",
                                    damping: 30,
                                    stiffness: 300,
                                }}
                                className={cn(
                                    "fixed z-50",
                                    "border-white/10 bg-slate-900/95 backdrop-blur-2xl",
                                    side === "left" && "border-r",
                                    side === "right" && "border-l",
                                    side === "bottom" && "border-t",
                                    config.className,
                                    className
                                )}
                            >
                                <div className="flex h-full flex-col">
                                    {/* Header */}

                                    <div className="flex items-start justify-between border-b border-white/10 p-6">
                                        <div>
                                            {title && (
                                                <DialogPrimitive.Title className="text-xl font-bold text-white">
                                                    {title}
                                                </DialogPrimitive.Title>
                                            )}

                                            {description && (
                                                <DialogPrimitive.Description className="mt-1 text-sm text-slate-400">
                                                    {description}
                                                </DialogPrimitive.Description>
                                            )}
                                        </div>

                                        <DialogPrimitive.Close className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                                            <X className="h-5 w-5" />
                                        </DialogPrimitive.Close>
                                    </div>

                                    {/* Body */}

                                    <div className="flex-1 overflow-y-auto p-6">
                                        {children}
                                    </div>
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}
