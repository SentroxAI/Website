"use client";

import { motion } from "framer-motion";

export default function AmbientGlow() {
    return (
        <>
            <motion.div
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 16,
                    ease: "easeInOut",
                }}
                className="
        absolute
        left-0
        top-20
        h-80
        w-80
        rounded-full
        bg-blue-500/25
        blur-[140px]
      "
            />

            <motion.div
                animate={{
                    x: [0, -30, 20, 0],
                    y: [0, 30, -20, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 18,
                    ease: "easeInOut",
                }}
                className="
        absolute
        right-0
        bottom-0
        h-96
        w-96
        rounded-full
        bg-cyan-500/20
        blur-[150px]
      "
            />
        </>
    );
}