"use client";

import { motion } from "framer-motion";

export default function WorkspaceGlow() {
    return (
        <>
            <motion.div
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -20, 20, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 12,
                    ease: "easeInOut",
                }}
                className="
          absolute
          left-8
          top-12
          h-72
          w-72
          rounded-full
          bg-blue-500/20
          blur-[120px]
        "
            />

            <motion.div
                animate={{
                    x: [0, -30, 20, 0],
                    y: [0, 30, -10, 0],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 16,
                    ease: "easeInOut",
                }}
                className="
          absolute
          right-10
          bottom-10
          h-80
          w-80
          rounded-full
          bg-cyan-500/20
          blur-[120px]
        "
            />
        </>
    );
}