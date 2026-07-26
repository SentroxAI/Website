"use client";

import { motion } from "framer-motion";
import { BillingCycle } from "./types";

interface PricingToggleProps {
    value: BillingCycle;
    onChange: (billing: BillingCycle) => void;
}

export default function PricingToggle({
    value,
    onChange,
}: PricingToggleProps) {
    const yearly = value === "yearly";

    return (
        <div className="flex items-center justify-center gap-4">
            <span
                className={`text-sm font-medium transition-colors ${!yearly ? "text-white" : "text-slate-400"
                    }`}
            >
                Monthly
            </span>

            <button
                onClick={() =>
                    onChange(yearly ? "monthly" : "yearly")
                }
                className="relative flex h-10 w-20 items-center rounded-full bg-white/10 backdrop-blur-xl"
            >
                <motion.div
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                    className="absolute h-8 w-8 rounded-full bg-blue-500 shadow-lg"
                    style={{
                        left: yearly ? "44px" : "4px",
                    }}
                />
            </button>

            <div className="flex items-center gap-2">
                <span
                    className={`text-sm font-medium transition-colors ${yearly ? "text-white" : "text-slate-400"
                        }`}
                >
                    Yearly
                </span>

                <motion.span
                    whileHover={{
                        scale: 1.05,
                    }}
                    className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400"
                >
                    Save 20%
                </motion.span>
            </div>
        </div>
    );
}