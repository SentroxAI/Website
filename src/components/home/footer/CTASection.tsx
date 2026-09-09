"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function CTASection() {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 40,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
            }}
            className="relative overflow-hidden rounded-2xl sm:rounded-[40px] border border-white/10 bg-white/5 px-5 py-12 sm:px-8 sm:py-20 backdrop-blur-3xl md:px-16"
        >
            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10" />

            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[120px]" />

            <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-[120px]" />

            <div className="relative mx-auto max-w-4xl text-center">

                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
                    Ready to Get Started?
                </span>

                <h2 className="mt-6 sm:mt-8 text-2xl sm:text-4xl font-bold text-white md:text-6xl">
                    Let's Build Something
                    <br />
                    Extraordinary Together
                </h2>

                <p className="mx-auto mt-5 sm:mt-8 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-300">
                    Whether you're launching a new business,
                    redesigning your website, or integrating AI,
                    we're ready to help you build your next digital experience.
                </p>

                <div className="mt-8 sm:mt-12 flex flex-col justify-center gap-4 sm:gap-5 sm:flex-row">

                    <Link href="/contact">

                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                            Start Your Project

                            <ArrowRight className="h-5 w-5" />

                        </motion.button>

                    </Link>

                    <Link href="/contact">

                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.98,
                            }}
                            className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl hover:bg-white/10"
                        >
                            <CalendarDays className="h-5 w-5" />

                            Book Free Consultation

                        </motion.button>

                    </Link>

                </div>

            </div>
        </motion.section>
    );
}