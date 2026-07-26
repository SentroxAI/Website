"use client";

import { motion } from "framer-motion";
import DashboardPreview from "./DashboardPreview";
import PhoneMockup from "./PhoneMockup";

export default function BrowserMockup() {
    return (
        <motion.div
            whileHover={{
                rotateX: 4,
                rotateY: -4,
                scale: 1.02,
            }}
            transition={{
                duration: .35,
            }}
            style={{
                transformStyle: "preserve-3d",
            }}
            className="relative"
        >
            {/* Glow */}

            <div className="absolute -inset-6 rounded-[40px] bg-blue-500/20 blur-3xl" />

            {/* Browser */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#08111F]/90 shadow-2xl backdrop-blur-xl">

                {/* Top */}

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

                    <div className="flex gap-2">

                        <div className="h-3 w-3 rounded-full bg-red-400" />

                        <div className="h-3 w-3 rounded-full bg-yellow-400" />

                        <div className="h-3 w-3 rounded-full bg-green-400" />

                    </div>

                    <div className="w-72 rounded-full bg-slate-800 py-2 text-center text-xs text-slate-400">
                        https://sentrox.ai
                    </div>

                    <div className="w-8" />

                </div>

                <DashboardPreview />

            </div>

            {/* Floating Phone */}

            <PhoneMockup />

        </motion.div>
    );
}