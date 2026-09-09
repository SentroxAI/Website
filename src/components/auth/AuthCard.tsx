"use client";

/* -------------------------------------------------------------------------- */
/*                              AUTH CARD                                      */
/*                                                                            */
/*  Glassmorphism card container used by all auth forms.                       */
/*  Features gradient border, inner glow, and entrance animation.             */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: ReactNode;
    className?: string;
}

export default function AuthCard({ children, className }: AuthCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "relative w-full max-w-md",
                className,
            )}
        >
            {/* ── Gradient border glow ─────────────────────────────────── */}
            <div
                className="absolute -inset-px rounded-3xl opacity-50 blur-sm"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(6,182,212,0.3), rgba(37,99,235,0.1))",
                }}
            />

            {/* ── Card body ───────────────────────────────────────────── */}
            <div
                className={cn(
                    "relative rounded-3xl",
                    "border border-white/[0.08]",
                    "bg-white/[0.03] backdrop-blur-2xl",
                    "shadow-[0_8px_60px_rgba(0,0,0,0.4)]",
                    "p-8 sm:p-10",
                )}
            >
                {/* ── Top-edge highlight ──────────────────────────────── */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
                    style={{
                        background:
                            "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
                    }}
                />

                {children}
            </div>
        </motion.div>
    );
}
