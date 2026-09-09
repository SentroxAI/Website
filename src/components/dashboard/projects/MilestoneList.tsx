"use client";

/* -------------------------------------------------------------------------- */
/*                        MILESTONE LIST                                      */
/*                                                                            */
/*  Expandable milestone accordion with task checkboxes.                      */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ProjectMilestone, TaskPriority } from "./data";

/* ── Priority config ───────────────────────────────────────────────────────── */

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
    low: { label: "Low", color: "text-slate-400" },
    medium: { label: "Medium", color: "text-cyan-400" },
    high: { label: "High", color: "text-amber-400" },
    urgent: { label: "Urgent", color: "text-red-400" },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

interface MilestoneListProps {
    milestones: ProjectMilestone[];
}

export default function MilestoneList({ milestones }: MilestoneListProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
        // Auto-expand in-progress milestones
        const inProgress = milestones.find((m) => !m.completed && m.tasks.some((t) => t.completed));
        return new Set(inProgress ? [inProgress.id] : milestones.length > 0 ? [milestones[0].id] : []);
    });

    const toggle = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-3">
            {milestones.map((milestone, index) => {
                const isExpanded = expandedIds.has(milestone.id);
                const completedTasks = milestone.tasks.filter((t) => t.completed).length;
                const totalTasks = milestone.tasks.length;
                const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                    <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.06 }}
                        className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    >
                        {/* Milestone header */}
                        <button
                            onClick={() => toggle(milestone.id)}
                            className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]"
                        >
                            {/* Status icon */}
                            {milestone.completed ? (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                            ) : (
                                <Circle className="h-5 w-5 shrink-0 text-sx-text-subtle" />
                            )}

                            {/* Title + progress */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            "text-sm font-medium truncate",
                                            milestone.completed
                                                ? "text-sx-text-muted line-through"
                                                : "text-white"
                                        )}
                                    >
                                        {milestone.title}
                                    </span>
                                    <Badge
                                        variant={milestone.completed ? "success" : "secondary"}
                                        size="sm"
                                    >
                                        {completedTasks}/{totalTasks}
                                    </Badge>
                                </div>
                                {/* Mini progress bar */}
                                <div className="mt-1.5 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            milestone.completed
                                                ? "bg-emerald-500"
                                                : "bg-blue-500"
                                        )}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>

                            {/* Due date */}
                            <span className="hidden sm:flex items-center gap-1 text-[11px] text-sx-text-subtle">
                                <Clock className="h-3 w-3" />
                                {new Date(milestone.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>

                            {/* Chevron */}
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="h-4 w-4 text-sx-text-subtle" />
                            </motion.div>
                        </button>

                        {/* Task list */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-white/[0.04] px-4 py-2">
                                        {milestone.tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center gap-3 py-2.5 pl-8"
                                            >
                                                {/* Checkbox */}
                                                {task.completed ? (
                                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                                                ) : (
                                                    <Circle className="h-4 w-4 shrink-0 text-sx-text-subtle" />
                                                )}

                                                {/* Title */}
                                                <span
                                                    className={cn(
                                                        "flex-1 text-sm",
                                                        task.completed
                                                            ? "text-sx-text-subtle line-through"
                                                            : "text-sx-text-secondary"
                                                    )}
                                                >
                                                    {task.title}
                                                </span>

                                                {/* Priority */}
                                                <span
                                                    className={cn(
                                                        "hidden sm:flex items-center gap-1 text-[10px] font-medium",
                                                        priorityConfig[task.priority].color
                                                    )}
                                                >
                                                    {task.priority === "urgent" && (
                                                        <AlertTriangle className="h-3 w-3" />
                                                    )}
                                                    {priorityConfig[task.priority].label}
                                                </span>

                                                {/* Assignee */}
                                                {task.assignee && (
                                                    <span className="hidden md:block text-[11px] text-sx-text-subtle truncate max-w-[100px]">
                                                        {task.assignee}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}
