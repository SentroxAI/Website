"use client";

/* -------------------------------------------------------------------------- */
/*                          ADMIN SECTION                                     */
/*                                                                            */
/*  Section wrapper with title, optional "View all" link, and stagger         */
/*  animation.  Admin-flavored variant — red/orange accent on hover.          */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSectionProps {
    title: string;
    viewAllHref?: string;
    viewAllLabel?: string;
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function AdminSection({
    title,
    viewAllHref,
    viewAllLabel = "View all",
    children,
    className,
    delay = 0,
}: AdminSectionProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn("", className)}
        >
            {/* Section header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="group flex items-center gap-1 text-xs font-medium text-sx-text-muted transition-colors hover:text-red-400"
                    >
                        {viewAllLabel}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </div>

            {/* Content */}
            {children}
        </motion.section>
    );
}
