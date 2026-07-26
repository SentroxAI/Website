"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavItemType } from "./types";

interface NavItemProps {
    item: NavItemType;
}

export default function NavItem({ item }: NavItemProps) {
    const pathname = usePathname();

    const isActive = pathname === item.href;

    return (
        <Link
            href={item.href}
            className="group relative px-1 py-2 text-sm font-medium transition-colors"
        >
            <span
                className={
                    isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                }
            >
                {item.title}
            </span>

            {isActive && (
                <motion.div
                    layoutId={isActive ? "active-nav" : undefined}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{
                        duration: 0.25,
                    }}
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left rounded-full bg-blue-500"
                />
            )}
        </Link>
    );
}