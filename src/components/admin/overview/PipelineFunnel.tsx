"use client";

/* -------------------------------------------------------------------------- */
/*                         PIPELINE FUNNEL                                    */
/*                                                                            */
/*  Horizontal bar visualization of lead pipeline stages.                     */
/*  Each stage bar is proportional to the count.                              */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { pipelineData, type PipelineStage } from "./data";

export default function PipelineFunnel({ className }: { className?: string }) {
    const maxCount = Math.max(...pipelineData.map((s) => s.count));
    const totalCount = pipelineData.reduce((sum, s) => sum + s.count, 0);
    const totalValue = pipelineData.reduce((sum, s) => {
        // Parse ₹X,XX,XXX format
        const numStr = s.value.replace(/[₹,]/g, "");
        return sum + parseInt(numStr, 10);
    }, 0);

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
            {/* Summary header */}
            <div className="flex items-baseline justify-between mb-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                        Pipeline Total
                    </p>
                    <p className="mt-1 text-xl font-bold text-white tabular-nums">
                        {totalCount} Leads
                    </p>
                </div>
                <p className="text-sm font-semibold text-sx-text-muted tabular-nums">
                    ₹{(totalValue / 100000).toFixed(1)}L value
                </p>
            </div>

            {/* Stage bars */}
            <div className="space-y-3">
                {pipelineData.map((stage, index) => (
                    <StageBar
                        key={stage.stage}
                        stage={stage}
                        maxCount={maxCount}
                        index={index}
                    />
                ))}
            </div>
        </motion.div>
    );
}

function StageBar({
    stage,
    maxCount,
    index,
}: {
    stage: PipelineStage;
    maxCount: number;
    index: number;
}) {
    const widthPercent = Math.max((stage.count / maxCount) * 100, 12); // min 12% for label visibility

    // Map the bg-color class to actual colors for the gradient
    const colorMap: Record<string, { from: string; to: string; text: string; bg: string }> = {
        "bg-blue-500": { from: "#3b82f6", to: "#60a5fa", text: "text-blue-400", bg: "bg-blue-500/10" },
        "bg-cyan-500": { from: "#06b6d4", to: "#22d3ee", text: "text-cyan-400", bg: "bg-cyan-500/10" },
        "bg-emerald-500": { from: "#10b981", to: "#34d399", text: "text-emerald-400", bg: "bg-emerald-500/10" },
        "bg-amber-500": { from: "#f59e0b", to: "#fbbf24", text: "text-amber-400", bg: "bg-amber-500/10" },
        "bg-green-500": { from: "#22c55e", to: "#4ade80", text: "text-green-400", bg: "bg-green-500/10" },
    };

    const colors = colorMap[stage.color] || colorMap["bg-blue-500"];

    return (
        <div className="group">
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: colors.from }}
                    />
                    <span className="text-xs font-medium text-white">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-semibold tabular-nums", colors.text)}>
                        {stage.count}
                    </span>
                    <span className="text-[11px] text-sx-text-subtle tabular-nums">
                        {stage.value}
                    </span>
                </div>
            </div>

            {/* Bar */}
            <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                />
            </div>
        </div>
    );
}
