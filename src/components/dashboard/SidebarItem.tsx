"use client";

/* -------------------------------------------------------------------------- */
/*                             SIDEBAR ITEM                                   */
/*                                                                            */
/*  Single navigation item in the dashboard sidebar.                          */
/*  Features: icon, label, active indicator, badge count, tooltip on collapse */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Tooltip from "@/components/ui/overlays/Tooltip";
import { useSidebarContext } from "@/providers/SidebarProvider";

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    badge?: number;
    onClick?: () => void;
}

export default function SidebarItem({
    href,
    icon,
    label,
    isActive = false,
    badge,
    onClick,
}: SidebarItemProps) {
    const { isCollapsed } = useSidebarContext();

    const content = (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-white/[0.07] text-white"
                    : "text-sx-text-muted hover:bg-white/[0.04] hover:text-sx-text-secondary",
                isCollapsed && "justify-center px-0"
            )}
        >
            {/* Active indicator bar */}
            {isActive && (
                <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-sx-primary-400 to-sx-accent-400"
                    transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                    }}
                />
            )}

            {/* Icon */}
            <span
                className={cn(
                    "flex shrink-0 items-center justify-center transition-colors",
                    isActive
                        ? "text-sx-primary-400"
                        : "text-sx-text-subtle group-hover:text-sx-text-muted",
                    isCollapsed ? "h-5 w-5" : "h-5 w-5"
                )}
            >
                {icon}
            </span>

            {/* Label */}
            {!isCollapsed && (
                <span className="flex-1 truncate">{label}</span>
            )}

            {/* Badge */}
            {!isCollapsed && badge !== undefined && badge > 0 && (
                <Badge variant="default" size="sm">
                    {badge > 99 ? "99+" : badge}
                </Badge>
            )}

            {/* Collapsed badge dot */}
            {isCollapsed && badge !== undefined && badge > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sx-primary-400" />
            )}
        </Link>
    );

    /* ── Wrap in tooltip when collapsed ─────────────────────────────────── */

    if (isCollapsed) {
        return (
            <Tooltip content={label} side="right" delay={0}>
                {content}
            </Tooltip>
        );
    }

    return content;
}
