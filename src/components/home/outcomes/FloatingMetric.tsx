"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface FloatingMetricProps {
    title: string;
    subtitle: string;
    delay?: number;
}

export default function FloatingMetric({
    title,
    subtitle,
    delay = 0,
}: FloatingMetricProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 40,
                scale: 0.9,
            }}
            animate={{
                opacity: 1,
                y: [0, -10, 0],
            }}
            transition={{
                opacity: {
                    duration: 0.8,
                    delay,
                },
                y: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay,
                },
            }}
            whileHover={{
                scale: 1.05,
            }}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-xl"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>

                <div>
                    <h4 className="font-semibold text-white">
                        {title}
                    </h4>

                    <p className="text-sm text-slate-400">
                        {subtitle}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}