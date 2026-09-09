"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import RatingStars from "./RatingStars";
import { Testimonial } from "./types";

interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
}

export default function TestimonialCard({
    testimonial,
    index,
}: TestimonialCardProps) {
    return (
        <motion.article
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
            transition={{
                delay: index * 0.08,
                duration: 0.5,
            }}
            whileHover={{
                y: -10,
                rotateX: 2,
                rotateY: 2,
                scale: 1.02,
            }}
            style={{
                transformStyle: "preserve-3d",
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl transition-all duration-500"
        >
            {/* Glow */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-cyan-500/0 transition-all duration-500 group-hover:from-blue-500/10 group-hover:via-transparent group-hover:to-cyan-500/10" />

            {/* Animated Border */}

            <div className="absolute inset-0 rounded-3xl border border-transparent transition-all duration-500 group-hover:border-blue-500/30" />

            {/* Quote */}

            <motion.div
                whileHover={{
                    rotate: 12,
                    scale: 1.1,
                }}
                className="absolute right-6 top-6"
            >
                <Quote className="h-10 w-10 text-blue-500/20" />
            </motion.div>

            {/* Client */}

            <div className="relative flex items-center gap-4">
                <motion.img
                    whileHover={{
                        scale: 1.08,
                    }}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-16 w-16 rounded-full border border-white/10 object-cover"
                />

                <div>
                    <h3 className="font-semibold text-white">
                        {testimonial.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                        {testimonial.role}
                    </p>

                    <p className="text-sm font-medium text-blue-400">
                        {testimonial.company}
                    </p>
                </div>
            </div>

            {/* Rating */}

            <div className="mt-6">
                <RatingStars rating={testimonial.rating} />
            </div>

            {/* Review */}

            <p className="mt-6 leading-8 text-slate-300">
                "{testimonial.review}"
            </p>

            {/* Footer */}

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-400">
                    {testimonial.industry}
                </span>

                <motion.span
                    whileHover={{
                        x: 5,
                    }}
                    className="text-sm font-medium text-white"
                >
                    Verified Client
                </motion.span>
            </div>
        </motion.article>
    );
}