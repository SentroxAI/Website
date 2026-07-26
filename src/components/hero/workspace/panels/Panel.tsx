"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PanelProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export default function Panel({
    title,
    children,
    className,
}: PanelProps) {
    return (
        <motion.div
            whileHover={{
                y: -6,
                scale: 1.01,
            }}
            transition={{
                duration: .25,
            }}
            className={cn(
                "group relative overflow-hidden rounded-[30px]",
                "border border-white/10",
                "bg-white/[0.05]",
                "backdrop-blur-3xl",
                "shadow-[0_30px_80px_rgba(0,0,0,.35)]",
                className
            )}
        >
            {/* Aurora */}
            <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute -top-24 left-0 h-56 w-56 rounded-full bg-blue-500/20 blur-[110px]" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-[120px]" />
            </div>

            {/* reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

            <div className="relative border-b border-white/10 px-6 py-5">
                <h3 className="text-sm font-semibold tracking-wide text-slate-200">
                    {title}
                </h3>
            </div>

            <div className="relative p-6">
                {children}
            </div>
        </motion.div>
    );
}