"use client";

import { motion } from "framer-motion";

import Panel from "./Panel";

const workflow = [
    "Lead Captured",
    "AI Analysis",
    "Website Generated",
    "Deployment",
];

export default function WorkflowPanel() {
    return (
        <Panel title="Automation Workflow">
            <div className="space-y-6">
                {workflow.map((step, index) => (
                    <div
                        key={step}
                        className="flex items-center gap-4"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                delay: index * 0.4,
                                duration: 2,
                            }}
                            className="size-4 rounded-full bg-green-400"
                        />

                        <span>{step}</span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}