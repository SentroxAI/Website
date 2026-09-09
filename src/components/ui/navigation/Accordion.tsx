"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
    icon?: ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
    variant?: "default" | "glass" | "bordered";
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Accordion({
    items,
    allowMultiple = false,
    defaultOpen = [],
    variant = "glass",
    className,
}: AccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggle = (id: string) => {
        if (allowMultiple) {
            setOpenItems((prev) =>
                prev.includes(id)
                    ? prev.filter((i) => i !== id)
                    : [...prev, id]
            );
        } else {
            setOpenItems((prev) =>
                prev.includes(id) ? [] : [id]
            );
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);

                return (
                    <div
                        key={item.id}
                        className={cn(
                            "overflow-hidden rounded-2xl transition-all duration-300",

                            variant === "glass" &&
                                "border border-white/10 bg-white/5 backdrop-blur-xl",

                            variant === "bordered" &&
                                "border border-white/10",

                            variant === "default" &&
                                "bg-white/[0.03]",

                            isOpen && variant === "glass" && "border-white/20"
                        )}
                    >
                        {/* Trigger */}

                        <button
                            onClick={() => toggle(item.id)}
                            className={cn(
                                "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
                                "transition-colors hover:bg-white/5"
                            )}
                            aria-expanded={isOpen}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon && (
                                    <span className="text-blue-400">
                                        {item.icon}
                                    </span>
                                )}

                                <span className="text-lg font-semibold text-white">
                                    {item.title}
                                </span>
                            </div>

                            <motion.div
                                animate={{
                                    rotate: isOpen ? 180 : 0,
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                            >
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            </motion.div>
                        </button>

                        {/* Content */}

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                    }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        height: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                        opacity: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    <div className="border-t border-white/10 px-6 py-5 text-slate-400 leading-7">
                                        {item.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
