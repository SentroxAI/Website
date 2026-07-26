"use client";

import { motion } from "framer-motion";

import Panel from "./Panel";

const activities = [
    "Website generated successfully",
    "SEO score improved to 98",
    "AI chatbot trained",
    "Deployment completed",
    "Client notified",
];

export default function ActivityPanel() {
    return (
        <Panel title="Recent Activity">
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity}
                        initial={{
                            opacity: 0,
                            x: -15,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: index * 0.15,
                        }}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                        <div className="size-2 rounded-full bg-green-400" />

                        <span className="text-sm">
                            {activity}
                        </span>
                    </motion.div>
                ))}
            </div>
        </Panel>
    );
}