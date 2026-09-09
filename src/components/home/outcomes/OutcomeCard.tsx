"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

import { Outcome } from "./types";

interface OutcomeCardProps {
    outcome: Outcome;
    index: number;
}

export default function OutcomeCard({
    outcome,
    index,
}: OutcomeCardProps) {
    const Icon = outcome.icon;

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 50,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
            }}
            transition={{
                duration: 0.6,
                delay: index * 0.08,
            }}
            whileHover={{
                y: -10,
                rotateX: 3,
                rotateY: 3,
                scale: 1.02,
            }}
            style={{
                transformStyle: "preserve-3d",
            }}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
            {/* Hover Glow */}

            <div
                className={`absolute inset-0 bg-gradient-to-br ${outcome.gradient} opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-15`}
            />

            {/* Border Glow */}

            <div
                className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${outcome.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                style={{
                    padding: "1px",
                    WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
            />

            <div className="relative">
                {/* Icon */}

                <motion.div
                    whileHover={{
                        rotate: 8,
                        scale: 1.1,
                    }}
                    className={`inline-flex rounded-2xl bg-gradient-to-br ${outcome.gradient} p-4 shadow-xl`}
                >
                    <Icon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Title */}

                <h3 className="mt-8 text-2xl font-bold text-white">
                    {outcome.title}
                </h3>

                {/* Description */}

                <p className="mt-4 leading-7 text-slate-400">
                    {outcome.description}
                </p>

                {/* Divider */}

                <div className="my-8 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                {/* Features */}

                <div className="space-y-4">
                    {outcome.features.map((feature, i) => (
                        <motion.div
                            key={feature}
                            initial={{
                                opacity: 0,
                                x: -15,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: i * 0.08,
                            }}
                            className="flex items-center gap-3"
                        >
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${outcome.gradient}`}
                            >
                                <Check className="h-4 w-4 text-white" />
                            </div>

                            <span className="text-slate-300">
                                {feature}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}

                <motion.div
                    whileHover={{
                        x: 5,
                    }}
                    className="mt-10 flex items-center justify-between border-t border-white/10 pt-6"
                >
                    <span className="text-sm font-medium text-slate-400">
                        Included with every project
                    </span>

                    <ArrowUpRight className="h-5 w-5 text-blue-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.div>
            </div>
        </motion.article>
    );
}