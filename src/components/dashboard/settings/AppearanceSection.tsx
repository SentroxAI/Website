"use client";

/* -------------------------------------------------------------------------- */
/*                     APPEARANCE SECTION                                     */
/*                                                                            */
/*  Theme selector, accent color picker, display options.                     */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { appearanceSettings, type AppearanceSettings } from "./data";

/* ── Accent colors ─────────────────────────────────────────────────────────── */

const accentColors = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
];

/* ── Theme cards ───────────────────────────────────────────────────────────── */

const themes: { id: AppearanceSettings["theme"]; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "dark", label: "Dark", icon: <Moon className="h-5 w-5" />, desc: "Optimized for low-light" },
    { id: "light", label: "Light", icon: <Sun className="h-5 w-5" />, desc: "Classic bright interface" },
    { id: "system", label: "System", icon: <Monitor className="h-5 w-5" />, desc: "Follow OS preference" },
];

/* ── Toggle helper ─────────────────────────────────────────────────────────── */

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-200",
                enabled ? "bg-sx-primary-600" : "bg-white/[0.1]"
            )}
        >
            <motion.span
                animate={{ x: enabled ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 h-4 w-4 rounded-full bg-white shadow-sm"
            />
        </button>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function AppearanceSection() {
    const [settings, setSettings] = useState(appearanceSettings);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Theme */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-white mb-4">Theme</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                    {themes.map((theme) => {
                        const isActive = settings.theme === theme.id;

                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSettings((p) => ({ ...p, theme: theme.id }))}
                                className={cn(
                                    "relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                                    isActive
                                        ? "border-sx-primary/40 bg-sx-primary/[0.06]"
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute top-2 right-2">
                                        <Check className="h-3.5 w-3.5 text-sx-primary-400" />
                                    </div>
                                )}
                                <div className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-xl",
                                    isActive ? "bg-sx-primary/20 text-sx-primary-400" : "bg-white/[0.04] text-sx-text-muted"
                                )}>
                                    {theme.icon}
                                </div>
                                <div className="text-center">
                                    <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-sx-text-secondary")}>
                                        {theme.label}
                                    </p>
                                    <p className="text-[10px] text-sx-text-subtle mt-0.5">{theme.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Accent Color */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-white mb-4">Accent Color</h4>
                <div className="flex flex-wrap gap-3">
                    {accentColors.map((color) => {
                        const isActive = settings.accentColor === color.value;

                        return (
                            <button
                                key={color.value}
                                onClick={() => setSettings((p) => ({ ...p, accentColor: color.value }))}
                                className="group flex flex-col items-center gap-1.5"
                                title={color.name}
                            >
                                <div
                                    className={cn(
                                        "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                                        isActive ? "border-white scale-110" : "border-transparent hover:scale-105"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                >
                                    {isActive && <Check className="h-4 w-4 text-white" />}
                                </div>
                                <span className="text-[10px] text-sx-text-subtle">{color.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Display Options */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-white mb-1">Display</h4>
                <div className="divide-y divide-white/[0.04]">
                    <div className="flex items-center justify-between py-3.5">
                        <div>
                            <p className="text-sm font-medium text-sx-text-secondary">Compact Mode</p>
                            <p className="text-xs text-sx-text-muted mt-0.5">Reduce spacing for denser content</p>
                        </div>
                        <Toggle
                            enabled={settings.compactMode}
                            onChange={(v) => setSettings((p) => ({ ...p, compactMode: v }))}
                        />
                    </div>
                    <div className="flex items-center justify-between py-3.5">
                        <div>
                            <p className="text-sm font-medium text-sx-text-secondary">Animations</p>
                            <p className="text-xs text-sx-text-muted mt-0.5">Enable smooth transitions and micro-animations</p>
                        </div>
                        <Toggle
                            enabled={settings.animationsEnabled}
                            onChange={(v) => setSettings((p) => ({ ...p, animationsEnabled: v }))}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
