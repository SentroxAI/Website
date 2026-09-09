"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Breadcrumbs({
    items,
    className,
}: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center gap-2 text-sm", className)}
        >
            {/* Home */}

            <Link
                href="/"
                className="text-slate-500 transition-colors hover:text-blue-400"
                aria-label="Home"
            >
                <Home className="h-4 w-4" />
            </Link>

            {/* Items */}

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={item.label} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-slate-600" />

                        {isLast || !item.href ? (
                            <span className="font-medium text-white">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-slate-400 transition-colors hover:text-blue-400"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
