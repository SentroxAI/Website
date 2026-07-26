"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface FeatureItemProps {
    feature: string;
    index: number;
}

export default function FeatureItem({
    feature,
    index,
}: FeatureItemProps) {
    return (
        <motion.li
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
                delay: index * 0.05,
                duration: 0.35,
            }}
            className="flex items-start gap-3"
        >
            <motion.div
                whileHover={{
                    scale: 1.15,
                    rotate: 8,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                }}
                className="mt-0.5"
            >
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
            </motion.div>

            <span className="leading-6 text-slate-300">
                {feature}
            </span>
        </motion.li>
    );
}