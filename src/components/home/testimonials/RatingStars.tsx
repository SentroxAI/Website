"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface RatingStarsProps {
    rating?: number;
    size?: number;
}

export default function RatingStars({
    rating = 5,
    size = 18,
}: RatingStarsProps) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: rating }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{
                        opacity: 0,
                        scale: 0.5,
                        rotate: -20,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 300,
                    }}
                    whileHover={{
                        scale: 1.25,
                        rotate: 10,
                    }}
                >
                    <Star
                        size={size}
                        className="fill-yellow-400 text-yellow-400"
                    />
                </motion.div>
            ))}
        </div>
    );
}