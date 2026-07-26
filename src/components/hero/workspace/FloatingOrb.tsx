"use client";

import { motion } from "framer-motion";

interface FloatingOrbProps {
    size: number;
    top: string;
    left?: string;
    right?: string;
    delay?: number;
}

export default function FloatingOrb({
    size,
    top,
    left,
    right,
    delay = 0,
}: FloatingOrbProps) {
    return (
        <motion.div
            animate={{
                y: [0, -20, 0],
                scale: [1, 1.08, 1],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                delay,
            }}
            style={{
                width: size,
                height: size,
                top,
                left,
                right,
            }}
            className="
        absolute
        rounded-full
        border
        border-white/10
        bg-white/10
        backdrop-blur-xl
      "
        />
    );
}