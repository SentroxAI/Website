"use client";

/* -------------------------------------------------------------------------- */
/*                           EMPTY STATE                                      */
/*                                                                            */
/*  Reusable empty state component for dashboard widgets.                     */
/*  Shows icon, title, description, and optional CTA button.                  */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex flex-col items-center justify-center px-6 py-12 text-center",
                className
            )}
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-sx-text-subtle">
                {icon}
            </div>
            <h3 className="text-sm font-semibold text-sx-text-secondary">
                {title}
            </h3>
            <p className="mt-1.5 max-w-xs text-xs text-sx-text-muted">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 rounded-lg bg-sx-primary-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20"
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}
