"use client";

import { motion } from "framer-motion";

export default function DashboardPreview() {
    return (
        <div className="p-6">

            {/* Hero */}

            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 p-8">

                <motion.h3
                    animate={{
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                    }}
                    className="text-3xl font-bold text-white"
                >
                    Hotel Booking Platform
                </motion.h3>

                <p className="mt-3 text-blue-100">
                    AI Powered Reservation Experience
                </p>

            </div>

            {/* Cards */}

            <div className="mt-6 grid grid-cols-3 gap-4">

                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        whileHover={{
                            y: -4,
                        }}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                        <div className="h-3 w-20 rounded bg-blue-400/40" />

                        <div className="mt-6 h-12 rounded-xl bg-slate-700" />

                        <div className="mt-5 h-3 w-16 rounded bg-slate-600" />

                    </motion.div>
                ))}

            </div>

            {/* Analytics */}

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">

                <div className="mb-6 h-4 w-36 rounded bg-slate-600" />

                <div className="flex h-44 items-end gap-4">

                    {[40, 90, 60, 120, 95, 150, 135].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                height: 0,
                            }}
                            whileInView={{
                                height: h,
                            }}
                            transition={{
                                delay: i * .1,
                            }}
                            className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400"
                        />
                    ))}

                </div>

            </div>

        </div>
    );
}