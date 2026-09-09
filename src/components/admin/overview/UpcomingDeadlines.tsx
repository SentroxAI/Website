"use client";

/* -------------------------------------------------------------------------- */
/*                       UPCOMING DEADLINES                                   */
/*                                                                            */
/*  Deadline cards with priority color coding and days-remaining countdown.   */
/*  Urgent deadlines (≤7 days) get a subtle pulse on the priority indicator.  */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { upcomingDeadlines, type Deadline } from "./data";

const priorityConfig: Record<
    Deadline["priority"],
    { dot: string; text: string; bg: string; label: string }
> = {
    high: {
        dot: "bg-red-500",
        text: "text-red-400",
        bg: "bg-red-500/10",
        label: "High",
    },
    medium: {
        dot: "bg-amber-500",
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        label: "Medium",
    },
    low: {
        dot: "bg-emerald-500",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        label: "Low",
    },
};

export default function UpcomingDeadlines({ className }: { className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5",
                className
            )}
        >
            <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                    <DeadlineCard key={deadline.id} deadline={deadline} index={index} />
                ))}
            </div>
        </motion.div>
    );
}

function DeadlineCard({
    deadline,
    index,
}: {
    deadline: Deadline;
    index: number;
}) {
    const config = priorityConfig[deadline.priority];
    const isUrgent = deadline.daysLeft <= 7;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className={cn(
                "group flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3.5 transition-all hover:border-white/[0.08] hover:bg-white/[0.03]",
                isUrgent && "border-red-500/10"
            )}
        >
            {/* Priority indicator */}
            <div className="relative mt-0.5 shrink-0">
                <div
                    className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        config.dot
                    )}
                />
                {isUrgent && (
                    <div
                        className={cn(
                            "absolute inset-0 h-2.5 w-2.5 rounded-full animate-ping",
                            config.dot
                        )}
                        style={{ animationDuration: "2s" }}
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">
                        {deadline.project}
                    </p>
                    <span
                        className={cn(
                            "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                            config.bg,
                            config.text
                        )}
                    >
                        {config.label}
                    </span>
                </div>
                <p className="mt-0.5 text-xs text-sx-text-muted truncate">
                    {deadline.milestone}
                </p>

                {/* Due date + countdown */}
                <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-sx-text-subtle">
                        <Clock className="h-3 w-3" />
                        {deadline.dueDate}
                    </span>
                    <span
                        className={cn(
                            "flex items-center gap-1 text-[11px] font-semibold",
                            isUrgent ? "text-red-400" : "text-sx-text-muted"
                        )}
                    >
                        {isUrgent && <AlertTriangle className="h-3 w-3" />}
                        {deadline.daysLeft}d left
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
