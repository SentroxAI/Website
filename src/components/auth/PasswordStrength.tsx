"use client";

/* -------------------------------------------------------------------------- */
/*                          PASSWORD STRENGTH                                  */
/*                                                                            */
/*  Real-time password strength indicator with animated segmented bar.        */
/*  Evaluates length, character variety, and common patterns.                 */
/* -------------------------------------------------------------------------- */

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
    className?: string;
}

interface StrengthResult {
    score: number;       // 0-4
    label: string;
    color: string;
    textColor: string;
}

function evaluateStrength(password: string): StrengthResult {
    if (!password) {
        return { score: 0, label: "", color: "", textColor: "" };
    }

    let score = 0;

    // Length checks
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Penalize common patterns
    const commonPatterns = [
        /^123/,
        /password/i,
        /qwerty/i,
        /abc123/i,
        /111/,
        /000/,
    ];
    if (commonPatterns.some((p) => p.test(password))) {
        score = Math.max(0, score - 2);
    }

    // Clamp to 0-4
    const clamped = Math.min(4, Math.max(0, score));

    const levels: StrengthResult[] = [
        { score: 0, label: "Too weak", color: "bg-red-500", textColor: "text-red-400" },
        { score: 1, label: "Weak", color: "bg-orange-500", textColor: "text-orange-400" },
        { score: 2, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-400" },
        { score: 3, label: "Good", color: "bg-emerald-500", textColor: "text-emerald-400" },
        { score: 4, label: "Strong", color: "bg-emerald-400", textColor: "text-emerald-400" },
    ];

    return levels[clamped];
}

export default function PasswordStrength({
    password,
    className,
}: PasswordStrengthProps) {
    const strength = useMemo(() => evaluateStrength(password), [password]);

    return (
        <AnimatePresence>
            {password.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("space-y-2", className)}
                >
                    {/* ── Segmented bar ───────────────────────────────── */}
                    <div className="flex gap-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]"
                            >
                                <motion.div
                                    className={cn(
                                        "h-full rounded-full",
                                        i < strength.score
                                            ? strength.color
                                            : "bg-transparent",
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: i < strength.score ? "100%" : "0%",
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        delay: i * 0.05,
                                        ease: "easeOut",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* ── Label ────────────────────────────────────────── */}
                    <motion.p
                        key={strength.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn("text-xs font-medium", strength.textColor)}
                    >
                        {strength.label}
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
