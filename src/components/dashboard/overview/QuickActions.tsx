"use client";

/* -------------------------------------------------------------------------- */
/*                          QUICK ACTIONS                                     */
/*                                                                            */
/*  Grid of quick action cards for common dashboard tasks.                    */
/*  Each card has icon, label, hover gradient, and navigation link.           */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Upload,
    Send,
    CalendarPlus,
    FolderKanban,
    Headphones,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { quickActionsData } from "./data";

/* ── Icon mapping ──────────────────────────────────────────────────────────── */

const iconMap: Record<string, React.ReactNode> = {
    Upload: <Upload className="h-5 w-5" />,
    Send: <Send className="h-5 w-5" />,
    CalendarPlus: <CalendarPlus className="h-5 w-5" />,
    FolderKanban: <FolderKanban className="h-5 w-5" />,
    Headphones: <Headphones className="h-5 w-5" />,
    CreditCard: <CreditCard className="h-5 w-5" />,
};

/* ── Color mapping ─────────────────────────────────────────────────────────── */

const colorConfig: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", hover: "from-blue-500/15" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", hover: "from-cyan-500/15" },
    violet: { bg: "bg-violet-500/10", text: "text-violet-400", hover: "from-violet-500/15" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", hover: "from-emerald-500/15" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", hover: "from-amber-500/15" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", hover: "from-rose-500/15" },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function QuickActions() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickActionsData.map((action, index) => {
                const colors = colorConfig[action.color] || colorConfig.blue;

                return (
                    <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: 0.1 + index * 0.05,
                            ease: "easeOut",
                        }}
                    >
                        <Link
                            href={action.href}
                            className={cn(
                                "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl p-4",
                                "border border-white/[0.06] bg-white/[0.02]",
                                "transition-all duration-300",
                                "hover:border-white/[0.12] hover:bg-white/[0.04]",
                                "hover:-translate-y-0.5 hover:shadow-lg"
                            )}
                        >
                            {/* Hover gradient */}
                            <div
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-b to-transparent opacity-0",
                                    "transition-opacity duration-500 group-hover:opacity-100",
                                    colors.hover
                                )}
                            />

                            <div className="relative">
                                <div
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                                        colors.bg,
                                        colors.text
                                    )}
                                >
                                    {iconMap[action.icon] || (
                                        <FolderKanban className="h-5 w-5" />
                                    )}
                                </div>
                            </div>

                            <span className="relative text-xs font-medium text-sx-text-secondary text-center leading-tight">
                                {action.label}
                            </span>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
