"use client";

/* -------------------------------------------------------------------------- */
/*                        DASHBOARD GREETING                                  */
/*                                                                            */
/*  Welcome header with user name, time-based greeting, and date display.     */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { useAuthContext } from "@/providers/AuthProvider";

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

export default function DashboardGreeting() {
    const { profile } = useAuthContext();
    const firstName = profile?.full_name?.split(" ")[0] || "there";
    const greeting = getGreeting();
    const date = formatDate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
        >
            <h1 className="text-2xl font-bold text-white md:text-3xl">
                {greeting}, {firstName} 👋
            </h1>
            <p className="mt-2 text-sm text-sx-text-muted">
                {date} — Here&apos;s what&apos;s happening with your projects today.
            </p>
        </motion.div>
    );
}
