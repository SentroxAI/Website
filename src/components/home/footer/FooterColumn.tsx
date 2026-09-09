"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { FooterColumn as FooterColumnType } from "./types";

interface FooterColumnProps {
    column: FooterColumnType;
    index?: number;
}

export default function FooterColumn({
    column,
    index = 0,
}: FooterColumnProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
            }}
        >
            <h3 className="mb-6 text-lg font-semibold text-white">
                {column.title}
            </h3>

            <ul className="space-y-4">
                {column.links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="group inline-flex items-center text-slate-400 transition-colors duration-300 hover:text-blue-400"
                        >
                            <span>{link.label}</span>

                            <span className="ml-2 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                →
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}