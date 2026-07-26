"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

import Panel from "./Panel";

const messages = [
    {
        role: "user",
        text: "Build a premium hotel website with online booking.",
    },
    {
        role: "assistant",
        text: "Generating website, booking engine, SEO optimization and AI chatbot...",
    },
];

export default function ChatPanel() {
    return (
        <Panel title="AI Assistant">
            <div className="flex h-full flex-col justify-between">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.3 }}
                            className={`flex gap-3 ${message.role === "assistant"
                                    ? "justify-start"
                                    : "justify-end"
                                }`}
                        >
                            {message.role === "assistant" && (
                                <Bot className="mt-1 size-5 text-cyan-400" />
                            )}

                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === "assistant"
                                        ? "bg-cyan-500/15"
                                        : "bg-blue-500/15"
                                    }`}
                            >
                                {message.text}
                            </div>

                            {message.role === "user" && (
                                <User className="mt-1 size-5 text-blue-400" />
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.2,
                    }}
                    className="mt-5 text-sm text-slate-400"
                >
                    AI is thinking...
                </motion.div>
            </div>
        </Panel>
    );
}