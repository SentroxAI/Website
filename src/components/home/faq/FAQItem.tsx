"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { FAQ } from "./types";

interface FAQItemProps {
    faq: FAQ;
    isOpen: boolean;
    onToggle: () => void;
}

export default function FAQItem({
    faq,
    isOpen,
    onToggle,
}: FAQItemProps) {
    return (
        <motion.div
            layout
            transition={{
                layout: {
                    duration: 0.35,
                    type: "spring",
                    stiffness: 120,
                },
            }}
            whileHover={{
                y: -2,
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl"
        >
            {/* Hover Glow */}

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-blue-500/5 group-hover:via-cyan-500/10 group-hover:to-blue-500/5" />

            {/* Question */}

            <button
                onClick={onToggle}
                className="relative flex w-full items-center justify-between gap-6 px-8 py-7 text-left"
                aria-expanded={isOpen}
            >
                <div className="flex-1">
                    {/* Category */}

                    <span className="mb-3 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                        {faq.category}
                    </span>

                    <h3 className="text-lg font-semibold leading-7 text-white transition-colors duration-300 group-hover:text-blue-300">
                        {faq.question}
                    </h3>
                </div>

                {/* Icon */}

                <motion.div
                    animate={{
                        rotate: isOpen ? 180 : 0,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                >
                    <ChevronDown className="h-5 w-5 text-blue-400" />
                </motion.div>
            </button>

            {/* Answer */}

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.35,
                            ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                    >
                        <div className="relative border-t border-white/10 px-8 pb-8 pt-6">
                            <p className="leading-8 text-slate-300">
                                {faq.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}