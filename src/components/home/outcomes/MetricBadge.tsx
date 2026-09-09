"use client";

import { motion } from "framer-motion";
import { Metric } from "./types";

interface MetricBadgeProps {
    metric: Metric;
    index?: number;
}

export default function MetricBadge({
    metric,
    index = 0,
}: MetricBadgeProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
            }}
            whileHover={{
                y: -8,
                scale: 1.03,
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
            {/* Glow */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-cyan-500/0 transition-all duration-500 group-hover:from-blue-500/10 group-hover:to-cyan-500/10" />

            <div className="relative">
                <h3 className="text-5xl font-bold text-white">
                    {metric.value}
                </h3>

                <h4 className="mt-4 text-lg font-semibold text-white">
                    {metric.label}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                    {metric.description}
                </p>
            </div>
        </motion.div>
    );
}