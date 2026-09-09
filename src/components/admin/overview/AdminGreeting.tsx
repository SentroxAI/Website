"use client";

/* -------------------------------------------------------------------------- */
/*                         ADMIN GREETING                                     */
/*                                                                            */
/*  Welcome header with time-based greeting, admin badge, and current date.   */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { useAuthContext } from "@/providers/AuthProvider";
import { Shield } from "lucide-react";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function formatDate(): string {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function AdminGreeting() {
    const { profile } = useAuthContext();
    const firstName = profile?.full_name?.split(" ")[0] || "Admin";
    const greeting = getGreeting();
    const date = formatDate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
        >
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                    {greeting}, {firstName}
                </h1>
                <span className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                    <Shield className="h-3 w-3" />
                    Admin
                </span>
            </div>
            <p className="mt-2 text-sm text-sx-text-muted">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-medium">
                    {date}
                </span>
                {" "}— Here&apos;s your agency overview.
            </p>
        </motion.div>
    );
}
