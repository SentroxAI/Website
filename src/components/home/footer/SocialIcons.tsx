"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { SocialLink } from "./types";

interface SocialIconsProps {
    socials: SocialLink[];
}

export default function SocialIcons({
    socials,
}: SocialIconsProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            {socials.map((social, index) => {
                const Icon = social.icon;

                return (
                    <motion.div
                        key={social.name}
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            delay: index * 0.08,
                        }}
                        whileHover={{
                            y: -6,
                            scale: 1.08,
                        }}
                    >
                        <Link
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10"
                        >
                            <Icon className="h-5 w-5 text-slate-300 transition-colors duration-300 group-hover:text-blue-400" />
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}