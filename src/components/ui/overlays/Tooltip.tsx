"use client";

import {
    useState,
    type ReactNode,
    type ReactElement,
    cloneElement,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface TooltipProps {
    content: ReactNode;
    children: ReactElement<{ onMouseEnter?: () => void; onMouseLeave?: () => void; onFocus?: () => void; onBlur?: () => void }>;
    side?: "top" | "bottom" | "left" | "right";
    delay?: number;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                            POSITION CLASSES                                */
/* -------------------------------------------------------------------------- */

const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowPositions = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800",
};

const origins = {
    top: { initial: { opacity: 0, y: 4, scale: 0.95 } },
    bottom: { initial: { opacity: 0, y: -4, scale: 0.95 } },
    left: { initial: { opacity: 0, x: 4, scale: 0.95 } },
    right: { initial: { opacity: 0, x: -4, scale: 0.95 } },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Tooltip({
    content,
    children,
    side = "top",
    delay = 200,
    className,
}: TooltipProps) {
    const [open, setOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(
        null
    );

    const show = () => {
        const id = setTimeout(() => setOpen(true), delay);
        setTimeoutId(id);
    };

    const hide = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setOpen(false);
    };

    return (
        <div className="relative inline-flex">
            {cloneElement(children, {
                onMouseEnter: show,
                onMouseLeave: hide,
                onFocus: show,
                onBlur: hide,
            })}

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={origins[side].initial}
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={origins[side].initial}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "pointer-events-none absolute z-50",
                            "whitespace-nowrap rounded-xl border border-white/10 bg-slate-800/95 px-3 py-2",
                            "text-sm text-white backdrop-blur-xl shadow-xl",
                            positions[side],
                            className
                        )}
                        role="tooltip"
                    >
                        {content}

                        {/* Arrow */}

                        <div
                            className={cn(
                                "absolute h-0 w-0",
                                "border-4 border-transparent",
                                arrowPositions[side]
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
