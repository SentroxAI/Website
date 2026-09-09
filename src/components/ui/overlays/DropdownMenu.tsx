"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                              DROPDOWN MENU                                 */
/* -------------------------------------------------------------------------- */

interface DropdownItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    danger?: boolean;
    disabled?: boolean;
    separator?: boolean;
}

interface DropdownMenuProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    align?: "left" | "right";
    className?: string;
}

export default function DropdownMenu({
    trigger,
    items,
    align = "right",
    className,
}: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    /* ── Close on outside click ──────────────────────────────────────── */

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    /* ── Close on Escape ─────────────────────────────────────────────── */

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        if (open) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => document.removeEventListener("keydown", handleEscape);
    }, [open]);

    return (
        <div ref={menuRef} className={cn("relative inline-block", className)}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                className="focus:outline-none"
            >
                {trigger}
            </button>

            {/* Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute z-50 mt-2 min-w-[200px] rounded-xl border border-white/10 bg-[#0a0f1e]/95 backdrop-blur-xl shadow-xl shadow-black/20",
                            "py-1.5",
                            align === "right" ? "right-0" : "left-0"
                        )}
                        role="menu"
                    >
                        {items.map((item, idx) => {
                            if (item.separator) {
                                return (
                                    <div
                                        key={`sep-${idx}`}
                                        className="my-1.5 h-px bg-white/8"
                                    />
                                );
                            }

                            const Component = item.href ? "a" : "button";

                            return (
                                <Component
                                    key={idx}
                                    href={item.href}
                                    role="menuitem"
                                    disabled={item.disabled}
                                    onClick={() => {
                                        if (item.disabled) return;
                                        item.onClick?.();
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                                        "text-left",
                                        item.danger
                                            ? "text-red-400 hover:bg-red-500/10"
                                            : "text-slate-300 hover:bg-white/5 hover:text-white",
                                        item.disabled && "opacity-40 cursor-not-allowed"
                                    )}
                                >
                                    {item.icon && (
                                        <span className="flex-shrink-0 w-4 h-4">
                                            {item.icon}
                                        </span>
                                    )}
                                    {item.label}
                                </Component>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
