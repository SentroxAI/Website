"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe } from "lucide-react";

import { CURRENCIES } from "./constants";
import { Currency } from "./types";

interface CurrencySelectorProps {
    value: Currency;
    onChange: (currency: Currency) => void;
}

export default function CurrencySelector({
    value,
    onChange,
}: CurrencySelectorProps) {
    const [open, setOpen] = useState(false);

    const selected =
        CURRENCIES.find((item) => item.code === value) ??
        CURRENCIES[0];

    return (
        <div className="relative">
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl transition-all hover:border-blue-500/40 hover:bg-white/10"
            >
                <Globe className="h-5 w-5 text-blue-400" />

                <span className="text-lg">
                    {selected.flag}
                </span>

                <div className="text-left">
                    <p className="text-sm font-medium text-white">
                        {selected.code}
                    </p>

                    <p className="text-xs text-slate-400">
                        {selected.label}
                    </p>
                </div>

                <motion.div
                    animate={{
                        rotate: open ? 180 : 0,
                    }}
                >
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 12,
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl"
                    >
                        {CURRENCIES.map((currency) => (
                            <motion.button
                                key={currency.code}
                                whileHover={{
                                    x: 5,
                                }}
                                onClick={() => {
                                    onChange(currency.code);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center gap-4 px-5 py-4 transition-colors ${value === currency.code
                                        ? "bg-blue-500/20"
                                        : "hover:bg-white/5"
                                    }`}
                            >
                                <span className="text-2xl">
                                    {currency.flag}
                                </span>

                                <div className="flex-1 text-left">
                                    <p className="font-medium text-white">
                                        {currency.code}
                                    </p>

                                    <p className="text-sm text-slate-400">
                                        {currency.label}
                                    </p>
                                </div>

                                <span className="font-semibold text-blue-400">
                                    {currency.symbol}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}