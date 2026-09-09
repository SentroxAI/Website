"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";

import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={cn(
                "flex flex-col items-center justify-center py-16 text-center",
                className
            )}
        >
            {/* Icon */}

            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
                {icon || (
                    <FileQuestion className="h-10 w-10 text-slate-500" />
                )}
            </div>

            {/* Title */}

            <h3 className="mt-6 text-2xl font-semibold text-white">
                {title}
            </h3>

            {/* Description */}

            {description && (
                <p className="mt-3 max-w-md text-slate-400">{description}</p>
            )}

            {/* Action */}

            {action && <div className="mt-8">{action}</div>}
        </motion.div>
    );
}
