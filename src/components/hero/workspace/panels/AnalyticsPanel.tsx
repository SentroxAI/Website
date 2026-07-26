"use client";

import { motion } from "framer-motion";
import Panel from "./Panel";

export default function AnalyticsPanel() {
    return (
        <Panel title="Website Analytics">
            <div className="space-y-6">
                <div className="flex justify-between">
                    <div>
                        <p className="text-sm text-slate-400">
                            Monthly Visitors
                        </p>

                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 text-4xl font-bold"
                        >
                            148K
                        </motion.h2>
                    </div>

                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                        +146%
                    </span>
                </div>

                <svg
                    viewBox="0 0 300 100"
                    className="h-36 w-full"
                >
                    <motion.path
                        d="M0 80 C60 50 120 60 180 30 C240 10 270 25 300 5"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        fill="none"
                        initial={{
                            pathLength: 0,
                        }}
                        animate={{
                            pathLength: 1,
                        }}
                        transition={{
                            duration: 2,
                        }}
                    />
                </svg>
            </div>
        </Panel>
    );
}