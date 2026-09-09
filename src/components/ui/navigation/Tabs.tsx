"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    variant?: "underline" | "pills" | "glass";
    onChange?: (tabId: string) => void;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Tabs({
    tabs,
    defaultTab,
    variant = "underline",
    onChange,
    className,
}: TabsProps) {
    const [activeTab, setActiveTab] = useState(
        defaultTab || tabs[0]?.id
    );

    const handleSelect = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const activeContent = tabs.find((t) => t.id === activeTab)?.content;

    return (
        <div className={cn("w-full", className)}>
            {/* Tab List */}

            <div
                className={cn(
                    "flex gap-1",
                    variant === "underline" &&
                        "border-b border-white/10",
                    variant === "glass" &&
                        "rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl",
                    variant === "pills" && "gap-2"
                )}
                role="tablist"
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => handleSelect(tab.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",

                                /* ── Underline ─────── */
                                variant === "underline" && [
                                    "-mb-px",
                                    isActive
                                        ? "text-white"
                                        : "text-slate-400 hover:text-white",
                                ],

                                /* ── Pills ─────────── */
                                variant === "pills" && [
                                    "rounded-2xl",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                                ],

                                /* ── Glass ─────────── */
                                variant === "glass" && [
                                    "rounded-xl flex-1 justify-center",
                                    isActive
                                        ? "text-white"
                                        : "text-slate-400 hover:text-white",
                                ]
                            )}
                        >
                            {tab.icon}
                            {tab.label}

                            {/* Underline Indicator */}

                            {variant === "underline" && isActive && (
                                <motion.div
                                    layoutId="tab-underline"
                                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-500"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                    }}
                                />
                            )}

                            {/* Glass Indicator */}

                            {variant === "glass" && isActive && (
                                <motion.div
                                    layoutId="tab-glass"
                                    className="absolute inset-0 rounded-xl bg-white/10"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="mt-6"
                role="tabpanel"
            >
                {activeContent}
            </motion.div>
        </div>
    );
}
