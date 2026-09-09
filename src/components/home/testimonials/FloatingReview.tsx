"use client";

import { motion } from "framer-motion";
import RatingStars from "./RatingStars";

interface FloatingReviewProps {
    title: string;
    subtitle: string;
    delay?: number;
}

export default function FloatingReview({
    title,
    subtitle,
    delay = 0,
}: FloatingReviewProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 40,
            }}
            animate={{
                opacity: 1,
                y: [0, -12, 0],
            }}
            transition={{
                opacity: {
                    duration: 0.8,
                    delay,
                },
                y: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 4,
                    ease: "easeInOut",
                    delay,
                },
            }}
            whileHover={{
                scale: 1.05,
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-2xl"
        >
            <RatingStars />

            <h4 className="mt-4 font-semibold text-white">
                {title}
            </h4>

            <p className="mt-2 text-sm text-slate-400">
                {subtitle}
            </p>
        </motion.div>
    );
}