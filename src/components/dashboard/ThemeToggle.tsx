"use client";

/* -------------------------------------------------------------------------- */
/*                            THEME TOGGLE                                    */
/*                                                                            */
/*  Sun/Moon icon toggle for dark/light mode.                                 */
/*  Uses next-themes useTheme() hook.                                         */
/*  Smooth icon rotation animation.                                           */
/* -------------------------------------------------------------------------- */

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    /* ── Prevent hydration mismatch ────────────────────────────────────── */
    useEffect(() => setMounted(true), []);
    if (!mounted) {
        return (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl">
                <div className="h-[18px] w-[18px]" />
            </div>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-sx-text-muted hover:bg-white/5 hover:text-white transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    {isDark ? (
                        <Sun className="h-[18px] w-[18px]" />
                    ) : (
                        <Moon className="h-[18px] w-[18px]" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    );
}
