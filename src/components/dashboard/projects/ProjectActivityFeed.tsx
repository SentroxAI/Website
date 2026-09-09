"use client";

/* -------------------------------------------------------------------------- */
/*                     PROJECT ACTIVITY FEED                                  */
/*                                                                            */
/*  Timeline of project activity on the detail page.                          */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    CheckSquare,
    Flag,
    FileText,
    MessageSquare,
    RefreshCw,
    Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/dashboard/overview/EmptyState";
import type { ProjectActivity } from "./data";

const typeConfig: Record<
    ProjectActivity["type"],
    { icon: React.ReactNode; bg: string; text: string }
> = {
    task: { icon: <CheckSquare className="h-3.5 w-3.5" />, bg: "bg-blue-500/15", text: "text-blue-400" },
    milestone: { icon: <Flag className="h-3.5 w-3.5" />, bg: "bg-emerald-500/15", text: "text-emerald-400" },
    file: { icon: <FileText className="h-3.5 w-3.5" />, bg: "bg-amber-500/15", text: "text-amber-400" },
    comment: { icon: <MessageSquare className="h-3.5 w-3.5" />, bg: "bg-cyan-500/15", text: "text-cyan-400" },
    status: { icon: <RefreshCw className="h-3.5 w-3.5" />, bg: "bg-violet-500/15", text: "text-violet-400" },
};

interface ProjectActivityFeedProps {
    activity: ProjectActivity[];
}

export default function ProjectActivityFeed({ activity }: ProjectActivityFeedProps) {
    if (activity.length === 0) {
        return (
            <EmptyState
                icon={<Inbox className="h-6 w-6" />}
                title="No activity yet"
                description="Activity will appear here as work progresses."
                className="rounded-xl border border-white/[0.06] bg-white/[0.02]"
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="space-y-0">
                {activity.map((item, index) => {
                    const config = typeConfig[item.type];
                    const isLast = index === activity.length - 1;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.05 }}
                            className="relative flex gap-3 pb-4 last:pb-0"
                        >
                            {!isLast && (
                                <div className="absolute left-[14px] top-8 bottom-0 w-px bg-white/[0.06]" />
                            )}
                            <div className={cn("relative z-10 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-lg", config.bg, config.text)}>
                                {config.icon}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-sm font-medium text-sx-text-secondary leading-snug">
                                    {item.title}
                                </p>
                                <p className="mt-0.5 text-xs text-sx-text-muted line-clamp-1">
                                    {item.description}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-sx-text-subtle">
                                    <span>{item.user}</span>
                                    <span>·</span>
                                    <span>{item.time}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
